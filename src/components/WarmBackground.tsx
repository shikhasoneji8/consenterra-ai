import { motion } from "framer-motion";

export default function WarmBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm gradient - subtle cream to sand */}
      <div className="absolute inset-0 warm-hero-gradient" />
      
      {/* Subtle warm accent shapes */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, 2, -1, 2, 0],
          scale: [1, 1.02, 0.99, 1.01, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Terracotta accent blob - very subtle */}
        <div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: "hsl(16 50% 54% / 0.06)" }}
        />
        {/* Forest green accent blob - very subtle */}
        <div 
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[130px]"
          style={{ backgroundColor: "hsl(160 30% 25% / 0.04)" }}
        />
      </motion.div>
    </div>
  );
}
