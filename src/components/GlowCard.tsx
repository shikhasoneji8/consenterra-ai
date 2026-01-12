import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export default function GlowCard({
  children,
  className = "",
  hoverEffect = true,
  delay = 0,
}: GlowCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl bg-card border border-border/50 overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={
        hoverEffect
          ? {
              y: -8,
              transition: { duration: 0.3 },
            }
          : {}
      }
      style={{
        boxShadow: hoverEffect 
          ? "0 4px 20px -5px hsl(270 80% 60% / 0.1)"
          : undefined,
      }}
    >
      {/* Gradient border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, hsl(270 80% 60% / 0.15) 0%, hsl(280 70% 55% / 0.05) 50%, hsl(260 90% 70% / 0.1) 100%)",
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        initial={{ opacity: 0.4 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Hover glow effect */}
      {hoverEffect && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            boxShadow: "inset 0 0 40px hsl(270 80% 60% / 0.08), 0 20px 50px -15px hsl(270 80% 60% / 0.2)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}