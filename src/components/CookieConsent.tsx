import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, Shield, X } from "lucide-react";
import { Link } from "react-router-dom";

type ConsentState = "pending" | "accepted" | "rejected" | "essential" | "hidden";

export default function CookieConsent() {
  const [state, setState] = useState<ConsentState>("hidden");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("consenterra-cookie-consent");
    if (!consent) {
      // Show after a slight delay for better UX
      const timer = setTimeout(() => setState("pending"), 1000);
      return () => clearTimeout(timer);
    }
    setState("hidden");
  }, []);

  const handleAccept = () => {
    localStorage.setItem("consenterra-cookie-consent", "accepted");
    setState("hidden");
  };

  const handleReject = () => {
    setShowDetails(true);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("consenterra-cookie-consent", "essential");
    setState("hidden");
  };

  const handleClose = () => {
    setState("hidden");
  };

  if (state === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {!showDetails ? (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your experience, analyze site traffic, and understand how you interact with our services. Your privacy is important to us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAccept} className="flex-1">
                  Accept All
                </Button>
                <Button onClick={handleReject} variant="outline" className="flex-1">
                  Reject Non-Essential
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Essential Cookies</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for basic site functionality. Cannot be disabled.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Cookie className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Analytics & Performance</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Help us understand how visitors interact with our site. Rejecting means we cannot improve based on usage patterns.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">
                Learn more in our{" "}
                <Link to="/privacy" className="text-primary hover:underline" onClick={handleClose}>
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAccept} className="flex-1">
                  Accept All
                </Button>
                <Button onClick={handleEssentialOnly} variant="secondary" className="flex-1">
                  Essential Only
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            We respect your choices. You can update preferences anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
