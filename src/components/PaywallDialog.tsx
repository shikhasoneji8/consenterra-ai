import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Shield } from "lucide-react";

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scanCount: number;
}

const PaywallDialog = ({ open, onOpenChange, scanCount }: PaywallDialogProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            You've reached your free limit
          </DialogTitle>
          <DialogDescription className="text-center">
            You've used {scanCount} out of 2 free scans. Upgrade to Pro for unlimited privacy analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Pro benefits include:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Unlimited website scans
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Advanced risk analysis
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                Priority support
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleUpgrade} className="w-full">
              View Plans
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallDialog;
