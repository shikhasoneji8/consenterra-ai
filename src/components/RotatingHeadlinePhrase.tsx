import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const phrases = [
  "everyday decisions",
  "digital consent",
  "privacy choices",
  "founder decisions",
  "ethical technology",
  "sustainable living",
  "informed consent",
  "responsible innovation",
  "data transparency",
  "human decisions"
];

interface RotatingHeadlinePhraseProps {
  className?: string;
}

export default function RotatingHeadlinePhrase({ className }: RotatingHeadlinePhraseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Rotation logic
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsAnimating(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused]);

  // If reduced motion or fallback, show static text
  if (prefersReducedMotion) {
    return (
      <span 
        className={cn(
          "text-gold italic underline underline-offset-4 decoration-2 decoration-gold",
          className
        )}
      >
        everyday decisions.
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-block text-gold italic underline underline-offset-4 decoration-2 decoration-gold transition-all duration-300",
        isAnimating && "opacity-0 translate-y-2",
        !isAnimating && "opacity-100 translate-y-0",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      aria-live="polite"
      aria-atomic="true"
    >
      {phrases[currentIndex]}.
    </span>
  );
}