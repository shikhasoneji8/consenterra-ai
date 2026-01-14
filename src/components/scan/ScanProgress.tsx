import { motion } from "framer-motion";
import { Loader2, CheckCircle, Globe, Shield, FileText } from "lucide-react";

interface ScanProgressProps {
  step: number;
}

const steps = [
  { icon: Globe, message: "Reading the page signals…" },
  { icon: Shield, message: "Checking tracking + consent patterns…" },
  { icon: FileText, message: "Summarizing risks…" },
];

export default function ScanProgress({ step }: ScanProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div 
        className="p-8 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="mb-6">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-6">Analyzing website...</h3>
        
        <div className="space-y-4 max-w-sm mx-auto">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isComplete = index < step;
            const isCurrent = index === step;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isCurrent ? 'bg-primary/10 border border-primary/30' : 
                  isComplete ? 'opacity-60' : 'opacity-40'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-green-500/20 text-green-400' :
                  isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {s.message}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
