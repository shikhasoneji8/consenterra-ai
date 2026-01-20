import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function AuroraBackground({ showParticles = true }: { showParticles?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!showParticles) return;
    
    // Generate random particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setParticles(newParticles);
  }, [showParticles]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora gradient blobs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, 5, -3, 5, 0],
          scale: [1, 1.05, 0.98, 1.03, 1],
          x: [0, 30, -20, 10, 0],
          y: [0, 20, -15, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[hsl(270_80%_60%/0.12)] blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(280_70%_55%/0.1)] blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-[hsl(260_90%_70%/0.08)] blur-[110px]" />
      </motion.div>

      {/* Secondary aurora layer for depth */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, -3, 4, -2, 0],
          scale: [1, 0.98, 1.04, 0.99, 1],
          x: [0, -20, 15, -25, 0],
          y: [0, 15, -20, 10, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(290_60%_50%/0.08)] blur-[90px]" />
        <div className="absolute bottom-1/3 left-1/2 w-[350px] h-[350px] rounded-full bg-[hsl(250_70%_60%/0.06)] blur-[80px]" />
      </motion.div>

      {/* Floating particles */}
      {showParticles && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[hsl(270_70%_70%)]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -40, -20, -60, 0],
            x: [0, 15, -10, 20, 0],
            opacity: [0.15, 0.35, 0.2, 0.4, 0.15],
            scale: [1, 1.3, 0.9, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}