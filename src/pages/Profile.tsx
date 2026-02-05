import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Shield, 
  Bell, 
  Palette,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  History,
  CreditCard,
  Loader2
} from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import GlowCard from "@/components/GlowCard";
import AnimatedSection from "@/components/AnimatedSection";

interface Profile {
  full_name: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
  country: string | null;
  email_verified: boolean;
}

interface Preferences {
  email_notifications: boolean;
  marketing_emails: boolean;
  product_updates: boolean;
  theme: string;
  analytics_enabled: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  scans_used: number;
  scans_limit: number;
}

export default function Profile() {
  const { user, signOut, isEmailVerified, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
    company: "",
    location: "",
    country: "",
    email_verified: false,
  });
  
  const [preferences, setPreferences] = useState<Preferences>({
    email_notifications: true,
    marketing_emails: false,
    product_updates: true,
    theme: "system",
    analytics_enabled: true,
  });
  
  const [subscription, setSubscription] = useState<Subscription>({
    plan: "free",
    status: "free",
    scans_used: 0,
    scans_limit: 5,
  });

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      try {
        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (profileData) {
          setProfile({
            full_name: profileData.full_name || "",
            email: profileData.email || user.email || "",
            company: profileData.company || "",
            location: profileData.location || "",
            country: profileData.country || "",
            email_verified: profileData.email_verified || false,
          });
        }

        // Load preferences
        const { data: prefsData } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (prefsData) {
          setPreferences({
            email_notifications: prefsData.email_notifications,
            marketing_emails: prefsData.marketing_emails,
            product_updates: prefsData.product_updates,
            theme: prefsData.theme,
            analytics_enabled: prefsData.analytics_enabled,
          });
        }

        // Load subscription
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (subData) {
          setSubscription({
            plan: subData.plan,
            status: subData.status,
            scans_used: subData.scans_used,
            scans_limit: subData.scans_limit,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          company: profile.company,
          location: profile.location,
          country: profile.country,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Track activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        activity_type: "profile_update",
        page_url: window.location.href,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({
          email_notifications: preferences.email_notifications,
          marketing_emails: preferences.marketing_emails,
          product_updates: preferences.product_updates,
          theme: preferences.theme,
          analytics_enabled: preferences.analytics_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    const { error } = await resendVerificationEmail();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    }
    setResendingEmail(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <AuroraBackground showParticles={false} />
      </div>

      <div className="section-container py-12 relative z-10">
        <AnimatedSection className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Account <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, preferences, and subscription
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Subscription */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Verification Alert */}
            {!isEmailVerified && (
              <AnimatedSection>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Verify your email</p>
                    <p className="text-sm text-muted-foreground">
                      Please verify your email address to unlock all features.
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                  >
                    {resendingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Resend"
                    )}
                  </Button>
                </div>
              </AnimatedSection>
            )}

            {/* Profile Card */}
            <AnimatedSection delay={0.1}>
              <GlowCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={profile.full_name || ""}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Your name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile.email || ""}
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                      {isEmailVerified && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company / Organization</Label>
                    <div className="relative mt-1.5">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={profile.company || ""}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Where you work"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profile.location || ""}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save changes
                  </Button>
                </div>
              </GlowCard>
            </AnimatedSection>

            {/* Preferences Card */}
            <AnimatedSection delay={0.2}>
              <GlowCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                    <p className="text-sm text-muted-foreground">Customize your experience</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                    </div>
                    <Switch
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, email_notifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Product updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about new features</p>
                    </div>
                    <Switch
                      checked={preferences.product_updates}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, product_updates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Marketing emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotional content</p>
                    </div>
                    <Switch
                      checked={preferences.marketing_emails}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, marketing_emails: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Analytics</p>
                      <p className="text-sm text-muted-foreground">Help us improve with usage data</p>
                    </div>
                    <Switch
                      checked={preferences.analytics_enabled}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, analytics_enabled: checked })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={saving} variant="outline" className="gap-2">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save preferences
                  </Button>
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>

          {/* Right Column - Subscription & Actions */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <AnimatedSection delay={0.3}>
              <GlowCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-muted-foreground">Current plan</p>
                  <p className="text-2xl font-bold text-foreground capitalize">{subscription.plan}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Status: <span className="text-primary capitalize">{subscription.status}</span>
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Scans used</span>
                    <span className="text-foreground font-medium">
                      {subscription.scans_used} / {subscription.scans_limit}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(subscription.scans_used / subscription.scans_limit) * 100}%` }}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => navigate("/pricing")}>
                  Upgrade plan
                </Button>
              </GlowCard>
            </AnimatedSection>

            {/* Quick Actions */}
            <AnimatedSection delay={0.4}>
              <GlowCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick actions</h2>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/solutions/prixplainer")}
                  >
                    <Shield className="h-4 w-4" />
                    New privacy scan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/scan-history")}
                  >
                    <History className="h-4 w-4" />
                    View scan history
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
