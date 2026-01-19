import { motion } from "framer-motion";
import { Brain, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceMeterProps {
  level: 'Low' | 'Medium' | 'High';
  className?: string;
}

export default function ConfidenceMeter({ level, className = "" }: ConfidenceMeterProps) {
  const getConfidenceConfig = () => {
    switch (level) {
      case 'High':
        return { 
          width: '100%', 
          color: 'from-green-500 to-green-400',
          bgColor: 'bg-green-500/10 border-green-500/20',
          textColor: 'text-green-400',
          label: 'High Confidence'
        };
      case 'Medium':
        return { 
          width: '66%', 
          color: 'from-yellow-500 to-yellow-400',
          bgColor: 'bg-yellow-500/10 border-yellow-500/20',
          textColor: 'text-yellow-400',
          label: 'Medium Confidence'
        };
      case 'Low':
        return { 
          width: '33%', 
          color: 'from-red-500 to-red-400',
          bgColor: 'bg-red-500/10 border-red-500/20',
          textColor: 'text-red-400',
          label: 'Low Confidence'
        };
      default:
        return { 
          width: '50%', 
          color: 'from-muted to-muted-foreground',
          bgColor: 'bg-muted/10 border-muted/20',
          textColor: 'text-muted-foreground',
          label: 'Unknown'
        };
    }
  };

  const config = getConfidenceConfig();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${className}`}
        >
          <Brain className={`h-3.5 w-3.5 ${config.textColor}`} />
          <span className={`text-xs font-medium ${config.textColor}`}>
            AI confidence: {level}
          </span>
          <div className="w-12 h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: config.width }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
            />
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[250px]">
        <div className="space-y-2">
          <p className="font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground">
            Based on policy completeness, data availability, and pattern matching accuracy.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
