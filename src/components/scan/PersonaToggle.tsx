import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Briefcase } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PersonaType = 'everyday' | 'privacy' | 'business';

interface PersonaToggleProps {
  value: PersonaType;
  onChange: (persona: PersonaType) => void;
  disabled?: boolean;
}

const personas = [
  { 
    id: 'everyday' as PersonaType, 
    label: 'Everyday User', 
    icon: User,
    description: 'Basic privacy awareness, focuses on key risks'
  },
  { 
    id: 'privacy' as PersonaType, 
    label: 'Privacy-conscious', 
    icon: Shield,
    description: 'Detailed analysis with technical insights'
  },
  { 
    id: 'business' as PersonaType, 
    label: 'Business / Founder', 
    icon: Briefcase,
    description: 'Compliance and liability focus'
  },
];

export default function PersonaToggle({ value, onChange, disabled }: PersonaToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">View as:</span>
      <div className={`flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50 ${disabled ? 'opacity-60' : ''}`}>
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isActive = value === persona.id;
          
          return (
            <Tooltip key={persona.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !disabled && onChange(persona.id)}
                  disabled={disabled}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    disabled ? 'cursor-not-allowed' :
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="persona-bg"
                      className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md"
                      transition={{ type: "spring", duration: 0.3 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="hidden sm:inline relative z-10">{persona.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="font-medium">{persona.label}</p>
                <p className="text-xs text-muted-foreground">{persona.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
