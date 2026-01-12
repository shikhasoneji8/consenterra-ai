import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import logo from "@/assets/ConsenTerra_Logo.png";

// ✅ IMPORTANT: adjust this import if your supabase client lives elsewhere
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // ✅ Get access token AFTER successful login
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();

      if (sessionErr) {
        console.error("Could not get session:", sessionErr);
      }

      const access_token = session?.access_token;

      // ✅ Call backend to log login event
      if (access_token) {
        const resp = await fetch("/api/auth/log-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
      
            // ✅ DEV ONLY: fake a public IP so geo resolves locally
            // remove this line when deployed
            "X-Forwarded-For": "8.8.8.8",
          },
          body: JSON.stringify({ access_token }),
        });
      
        if (!resp.ok) {
          const msg = await resp.text();
          console.error("log-login failed:", msg);
        }
      } else {
        console.warn("No access token found after login.");
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="ConsenTerra" className="h-12 w-12" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign in
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}