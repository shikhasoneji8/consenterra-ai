import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SeverityBadgeProps {
  severity: 'green' | 'yellow' | 'red';
  label?: string;
}

const severityConfig = {
  green: {
    emoji: '🟢',
    label: 'Neutral',
    description: 'This aspect appears to follow standard practices.',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-400',
  },
  yellow: {
    emoji: '🟡',
    label: 'Caution',
    description: 'Some concerns worth noting, but not critical.',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-400',
  },
  red: {
    emoji: '🔴',
    label: 'Blocker',
    description: 'Significant privacy concern requiring attention.',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-400',
  },
};

export default function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  const config = severityConfig[severity] || severityConfig.green;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium cursor-help border ${config.bgColor} ${config.borderColor} ${config.textColor}`}
        >
          <span>{config.emoji}</span>
          <span>{label || config.label}</span>
        </motion.span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <p className="font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
