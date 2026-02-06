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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if email is verified
  const isEmailVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Track login events
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to avoid blocking the auth flow
          setTimeout(async () => {
            try {
              // Determine signup method
              const isGoogleUser = session.user.app_metadata?.provider === 'google';
              const signupMethod = isGoogleUser ? 'google' : 'email';

              // Check if this is a brand new user (created in last 60 seconds)
              const createdAt = new Date(session.user.created_at).getTime();
              const now = Date.now();
              const isNewUser = (now - createdAt) < 60000;

              // Track signup for new users
              if (isNewUser) {
                await supabase.from('user_activity').insert({
                  user_id: session.user.id,
                  activity_type: 'signup',
                  activity_data: {
                    signup_method: signupMethod,
                    email: session.user.email,
                  },
                  page_url: window.location.href,
                  user_agent: navigator.userAgent,
                });
              }

              // Track login event in login_events table
              await supabase.from('login_events').insert({
                user_id: session.user.id,
                email: session.user.email,
                user_agent: navigator.userAgent,
              });
              
              // Update last_login_at in profiles
              await supabase.from('profiles').update({
                last_login_at: new Date().toISOString(),
              }).eq('user_id', session.user.id);

              // Update last_login_at in user_profiles
              await supabase.from('user_profiles').update({
                last_login_at: new Date().toISOString(),
                login_count: supabase.rpc ? undefined : undefined, // Will increment separately if needed
              }).eq('user_id', session.user.id);

              // Track login activity
              await supabase.from('user_activity').insert({
                user_id: session.user.id,
                activity_type: 'login',
                activity_data: {
                  login_method: signupMethod,
                },
                user_agent: navigator.userAgent,
                page_url: window.location.href,
              });
            } catch (error) {
              console.error('Error tracking login:', error);
            }
          }, 0);
        }

        // Handle password recovery event
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery mode activated');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
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
      
      // Track signup event immediately (profile creation handled by trigger)
      if (data?.user && !error) {
        setTimeout(async () => {
          try {
            await supabase.from('user_activity').insert({
              user_id: data.user!.id,
              activity_type: 'signup',
              activity_data: {
                signup_method: 'email',
                email: email,
                full_name: fullName,
              },
              page_url: window.location.href,
              user_agent: navigator.userAgent,
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
    // Track logout activity before signing out
    if (user) {
      try {
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: 'logout',
          user_agent: navigator.userAgent,
          page_url: window.location.href,
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
