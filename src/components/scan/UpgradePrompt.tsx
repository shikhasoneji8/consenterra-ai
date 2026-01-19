import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradePromptProps {
  isGuest?: boolean;
}

export default function UpgradePrompt({ isGuest = false }: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isGuest ? "Want deeper explanations or unlimited scans?" : "Unlock advanced features"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isGuest ? "Create a free account to continue." : "Compare policies, get alerts, and more."}
            </p>
          </div>
        </div>
        
        <Link
          to={isGuest ? "/signup" : "/pricing"}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors group"
        >
          {isGuest ? "Sign up free" : "View plans"}
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
