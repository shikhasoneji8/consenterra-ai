import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEmailVerified: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get IP address
async function getIpAddress(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const data = await response.json();
      return data.ip || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper function to get geo data from IP
async function getGeoData(ip: string): Promise<{ country: string | null; region: string | null; city: string | null; timezone: string | null }> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          country: data.country_name || null,
          region: data.region || null,
          city: data.city || null,
          timezone: data.timezone || null,
        };
      }
    }
    return { country: null, region: null, city: null, timezone: null };
  } catch {
    return { country: null, region: null, city: null, timezone: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isEmailVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Track login events
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              // Get IP and geo data
              const ip = await getIpAddress();
              const geoData = ip ? await getGeoData(ip) : { country: null, region: null, city: null, timezone: null };

              // Determine signup method
              const isGoogleUser = session.user.app_metadata?.provider === 'google';
              const signupMethod = isGoogleUser ? 'google' : 'email';

              // Check if new user (created in last 60 seconds)
              const createdAt = new Date(session.user.created_at).getTime();
              const isNewUser = (Date.now() - createdAt) < 60000;

              // For NEW users: update profile with signup info
              if (isNewUser) {
                await supabase.from('profiles').update({
                  signup_method: signupMethod,
                  signup_ip: ip,
                  signup_country: geoData.country,
                  signup_region: geoData.region,
                  signup_city: geoData.city,
                  full_name: session.user.user_metadata?.full_name || null,
                }).eq('user_id', session.user.id);

                // Track signup activity
                await supabase.from('user_activity').insert({
                  user_id: session.user.id,
                  activity_type: 'signup',
                  activity_data: {
                    signup_method: signupMethod,
                    email: session.user.email,
                    country: geoData.country,
                    city: geoData.city,
                  },
                  page_url: window.location.href,
                  user_agent: navigator.userAgent,
                  ip_address: ip,
                });
              }

              // Track login in login_events table (matches your actual schema)
              await supabase.from('login_events').insert({
                user_id: session.user.id,
                email: session.user.email,
                ip: ip,
                geo: {
                  country: geoData.country,
                  region: geoData.region,
                  city: geoData.city,
                  timezone: geoData.timezone,
                },
              });

              // Update profiles with last login info
              await supabase.from('profiles').update({
                last_login_at: new Date().toISOString(),
                last_login_ip: ip,
                last_login_country: geoData.country,
                last_login_region: geoData.region,
                last_login_city: geoData.city,
              }).eq('user_id', session.user.id);

              // Track login activity
              await supabase.from('user_activity').insert({
                user_id: session.user.id,
                activity_type: 'login',
                activity_data: {
                  login_method: signupMethod,
                  country: geoData.country,
                  city: geoData.city,
                },
                user_agent: navigator.userAgent,
                page_url: window.location.href,
                ip_address: ip,
              });

            } catch (error) {
              console.error('Error tracking login:', error);
            }
          }, 0);
        }

        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery mode activated');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Get geo data before signup
      const ip = await getIpAddress();
      const geoData = ip ? await getGeoData(ip) : { country: null, region: null, city: null, timezone: null };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: {
            full_name: fullName || '',
            signup_method: 'email',
          }
        }
      });

      // Track signup immediately
      if (data?.user && !error) {
        setTimeout(async () => {
          try {
            // Update profile with signup geo data
            await supabase.from('profiles').upsert({
              user_id: data.user!.id,
              email: email,
              full_name: fullName || null,
              signup_method: 'email',
              signup_ip: ip,
              signup_country: geoData.country,
              signup_region: geoData.region,
              signup_city: geoData.city,
            }, { onConflict: 'user_id' });

            // Track signup activity
            await supabase.from('user_activity').insert({
              user_id: data.user!.id,
              activity_type: 'signup',
              activity_data: {
                signup_method: 'email',
                email: email,
                full_name: fullName,
                country: geoData.country,
                city: geoData.city,
              },
              page_url: window.location.href,
              user_agent: navigator.userAgent,
              ip_address: ip,
            });
          } catch (e) {
            console.error('Error tracking signup:', e);
          }
        }, 100);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google' as Provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (user) {
      try {
        const ip = await getIpAddress();
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'logout',
          user_agent: navigator.userAgent,
          page_url: window.location.href,
          ip_address: ip,
        });
      } catch (error) {
        console.error('Error tracking logout:', error);
      }
    }
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      return { error: new Error('No email address found') };
    }
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isEmailVerified,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updatePassword,
      resendVerificationEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
