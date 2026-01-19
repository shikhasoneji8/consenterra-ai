import { motion } from "framer-motion";
import { Shield, Database, Eye, Lightbulb } from "lucide-react";

const principles = [
  { icon: Database, text: "No data stored without consent" },
  { icon: Eye, text: "No policy text used to train models" },
  { icon: Lightbulb, text: "Explainability-first approach" },
];

export default function ResponsibleAIBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50"
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Responsible AI</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {principles.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <motion.div
              key={principle.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary/70" />
              <span>{principle.text}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
