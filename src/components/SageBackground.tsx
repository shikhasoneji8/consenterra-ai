import { motion } from "framer-motion";

export default function SageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sage gradient - light gray to subtle green tint */}
      <div className="absolute inset-0 sage-hero-gradient" />
      
      {/* Subtle sage accent shapes */}
      <motion.div
        className="absolute -top-1/2 -right-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, 1, -1, 1, 0],
          scale: [1, 1.01, 0.99, 1.01, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Sage green accent blob - subtle */}
        <div 
          className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full blur-[180px]"
          style={{ backgroundColor: "hsl(143 20% 56% / 0.08)" }}
        />
        {/* Lighter sage blob */}
        <div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: "hsl(143 15% 70% / 0.06)" }}
        />
      </motion.div>
    </div>
  );
}
