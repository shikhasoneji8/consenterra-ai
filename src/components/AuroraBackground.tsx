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
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Always-on purple wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-violet-950/20 to-slate-950/60" />

      {/* Aurora gradient blobs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, 2, -2, 2, 0],
          scale: [1, 1.03, 0.99, 1.02, 1],
          x: [0, 12, -10, 8, 0],
          y: [0, 8, -6, 10, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-[hsl(270_90%_65%/0.22)] blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-[hsl(285_85%_60%/0.18)] blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[520px] h-[520px] rounded-full bg-[hsl(255_95%_70%/0.16)] blur-[150px]" />
      </motion.div>

      {/* Secondary aurora layer for depth */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%]"
        animate={{
          rotate: [0, -2, 2, -2, 0],
          scale: [1, 0.99, 1.03, 0.99, 1],
          x: [0, -10, 8, -12, 0],
          y: [0, 7, -9, 6, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <div className="absolute top-1/3 right-1/4 w-[520px] h-[520px] rounded-full bg-[hsl(295_70%_55%/0.14)] blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/2 w-[450px] h-[450px] rounded-full bg-[hsl(250_80%_65%/0.12)] blur-[110px]" />
      </motion.div>

      {/* Floating particles */}
      {showParticles &&
        particles.map((particle) => (
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
              opacity: [0.12, 0.28, 0.18, 0.32, 0.12],
              scale: [1, 1.25, 0.95, 1.15, 1],
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