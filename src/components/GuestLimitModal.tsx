import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus, LogIn, Shield, Sparkles } from "lucide-react";

interface GuestLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuestLimitModal = ({ open, onOpenChange }: GuestLimitModalProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate("/signup");
  };

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            You've used your 2 free PriXplainer analyses
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Create an account or log in to continue scanning websites for privacy risks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">With an account, you get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                Unlimited privacy scans
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                Scan history & saved reports
              </li>
              <li className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary flex-shrink-0" />
                Free to create an account
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleSignUp} className="w-full" size="lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            It only takes 30 seconds to create an account
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLimitModal;
