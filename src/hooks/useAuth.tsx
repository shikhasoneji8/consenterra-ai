import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getGeoData, getDeviceInfo } from "@/utils/geoUtils";

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
              // Get geo data (IP + location)
              const geoData = await getGeoData();
              const deviceInfo = getDeviceInfo();
              
              // Determine signup method
              const isGoogleUser = session.user.app_metadata?.provider === 'google';
              const signupMethod = isGoogleUser ? 'google' : 'email';

              // Check if this is a brand new user (created in last 60 seconds)
              const createdAt = new Date(session.user.created_at).getTime();
              const now = Date.now();
              const isNewUser = (now - createdAt) < 60000;

              // For NEW users: Update profile with signup geo data
              if (isNewUser) {
                // Update profiles table with signup info
                await supabase.from('profiles').update({
                  signup_method: signupMethod,
                  signup_ip: geoData.ip,
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
                    full_name: session.user.user_metadata?.full_name || null,
                    ...deviceInfo,
                  },
                  page_url: window.location.href,
                  user_agent: navigator.userAgent,
                  ip_address: geoData.ip,
                });
              }

              // Track login event in login_events table
              await supabase.from('login_events').insert({
                user_id: session.user.id,
                email: session.user.email,
                ip: geoData.ip,
                user_agent: navigator.userAgent,
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
                last_login_ip: geoData.ip,
                last_login_country: geoData.country,
                last_login_region: geoData.region,
                last_login_city: geoData.city,
              }).eq('user_id', session.user.id);

              // Update user_profiles with last login info
              await supabase.from('user_profiles').update({
                last_login_at: new Date().toISOString(),
                geo_country: geoData.country,
                geo_region: geoData.region,
                geo_city: geoData.city,
                geo_timezone: geoData.timezone,
              }).eq('user_id', session.user.id);

              // Track login in user_activity
              await supabase.from('user_activity').insert({
                user_id: session.user.id,
                activity_type: 'login',
                activity_data: {
                  login_method: signupMethod,
                  country: geoData.country,
                  city: geoData.city,
                  timezone: geoData.timezone,
                  ...deviceInfo,
                },
                user_agent: navigator.userAgent,
                page_url: window.location.href,
                ip_address: geoData.ip,
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
      const geoData = await getGeoData();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: {
            full_name: fullName || '',
            signup_method: 'email',
            signup_ip: geoData.ip,
            signup_country: geoData.country,
            signup_city: geoData.city,
          }
        }
      });
      
      // Update profile immediately after signup with geo data
      if (data?.user && !error) {
        setTimeout(async () => {
          try {
            // Update profiles table
            await supabase.from('profiles').upsert({
              user_id: data.user!.id,
              email: email,
              full_name: fullName || null,
              signup_method: 'email',
              signup_ip: geoData.ip,
              signup_country: geoData.country,
              signup_region: geoData.region,
              signup_city: geoData.city,
            }, { onConflict: 'user_id' });

            // Track signup in user_activity
            await supabase.from('user_activity').insert({
              user_id: data.user!.id,
              activity_type: 'signup',
              activity_data: {
                signup_method: 'email',
                email: email,
                full_name: fullName,
                country: geoData.country,
                city: geoData.city,
                timezone: geoData.timezone,
              },
              page_url: window.location.href,
              user_agent: navigator.userAgent,
              ip_address: geoData.ip,
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
        const geoData = await getGeoData();
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'logout',
          activity_data: {
            country: geoData.country,
            city: geoData.city,
          },
          user_agent: navigator.userAgent,
          page_url: window.location.href,
          ip_address: geoData.ip,
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
