import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg" | "sm";
  disabled?: boolean;
  asChild?: boolean;
}

export default function GlowButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  size = "default",
  disabled = false,
}: GlowButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full overflow-hidden";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "bg-transparent text-foreground hover:bg-muted",
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "spark-hover",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={
        variant === "primary"
          ? {
              boxShadow: "0 0 25px hsl(270 80% 60% / 0.35), 0 0 50px hsl(270 80% 60% / 0.15)",
            }
          : variant === "outline"
          ? {
              boxShadow: "0 0 15px hsl(270 80% 60% / 0.15)",
            }
          : {}
      }
    >
      {/* Animated glow pulse */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px hsl(270 80% 60% / 0.3), 0 0 40px hsl(270 80% 60% / 0.15)",
              "0 0 35px hsl(270 80% 60% / 0.45), 0 0 60px hsl(270 80% 60% / 0.25)",
              "0 0 20px hsl(270 80% 60% / 0.3), 0 0 40px hsl(270 80% 60% / 0.15)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}