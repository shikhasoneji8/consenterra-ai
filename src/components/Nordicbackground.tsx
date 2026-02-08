import { motion } from "framer-motion";

export default function NordicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Nordic gradient - pure white to very light blue-gray */}
      <div className="absolute inset-0 nordic-hero-gradient" />
      
      {/* Very subtle blue accent - almost invisible */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[100%] h-[100%]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Single blue accent blob - very subtle */}
        <div 
          className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ backgroundColor: "hsl(217 91% 60% / 0.04)" }}
        />
      </motion.div>
    </div>
  );
}
