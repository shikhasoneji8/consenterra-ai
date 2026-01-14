import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DemoSlide {
  title: string;
  description: string;
  bullets?: string[];
  image?: string;
  highlight?: string;
}

interface DemoCarouselProps {
  slides: DemoSlide[];
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

export default function DemoCarousel({ 
  slides, 
  title = "How It Works",
  subtitle,
}: DemoCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  }, [slides.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  }, [prevSlide, nextSlide]);

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="max-w-5xl mx-auto" onKeyDown={handleKeyDown} tabIndex={0}>
          {/* Carousel Container - Dark forest/emerald theme */}
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, hsl(160 30% 8%) 0%, hsl(150 25% 6%) 50%, hsl(170 20% 5%) 100%)',
              boxShadow: '0 25px 60px -15px hsl(160 40% 20% / 0.3), 0 0 40px -10px hsl(160 50% 30% / 0.15), inset 0 1px 0 hsl(160 30% 20% / 0.3)',
            }}
          >
            {/* Inner glow border */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              border: '1px solid hsl(160 30% 25% / 0.4)',
              background: 'linear-gradient(180deg, hsl(160 30% 20% / 0.1) 0%, transparent 30%)',
            }} />

            {/* Slides */}
            <div className="relative min-h-[450px] md:min-h-[480px] p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full"
                >
                  <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Left - Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      {/* Step indicator */}
                      <div className="inline-flex items-center gap-3 mb-6">
                        <span 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{
                            background: 'linear-gradient(135deg, hsl(160 60% 40%) 0%, hsl(150 50% 35%) 100%)',
                            color: 'hsl(160 20% 98%)',
                            boxShadow: '0 4px 15px hsl(160 50% 30% / 0.4)',
                          }}
                        >
                          {currentSlide + 1}
                        </span>
                        <span 
                          className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{
                            background: 'hsl(160 30% 15% / 0.6)',
                            color: 'hsl(160 30% 70%)',
                            border: '1px solid hsl(160 30% 25% / 0.5)',
                          }}
                        >
                          Step {currentSlide + 1} of {slides.length}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 
                        className="text-2xl md:text-3xl font-bold mb-5 leading-tight"
                        style={{ color: 'hsl(160 20% 95%)' }}
                      >
                        {slides[currentSlide].title}
                      </h3>
                      
                      {/* Description */}
                      <p 
                        className="text-lg leading-relaxed mb-6"
                        style={{ color: 'hsl(160 15% 75%)', lineHeight: 1.7 }}
                      >
                        {slides[currentSlide].description}
                      </p>

                      {/* Bullets if present */}
                      {slides[currentSlide].bullets && slides[currentSlide].bullets!.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {slides[currentSlide].bullets!.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span 
                                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                style={{ background: 'hsl(160 60% 50%)' }}
                              />
                              <span style={{ color: 'hsl(160 15% 70%)', fontSize: '1rem' }}>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Highlight callout */}
                      {slides[currentSlide].highlight && (
                        <div 
                          className="p-4 rounded-xl flex items-start gap-3"
                          style={{
                            background: 'linear-gradient(135deg, hsl(160 30% 12%) 0%, hsl(150 25% 10%) 100%)',
                            border: '1px solid hsl(160 40% 30% / 0.5)',
                          }}
                        >
                          <Lightbulb 
                            className="w-5 h-5 flex-shrink-0 mt-0.5" 
                            style={{ color: 'hsl(50 80% 60%)' }} 
                          />
                          <p 
                            className="text-sm font-medium leading-relaxed"
                            style={{ color: 'hsl(160 20% 85%)' }}
                          >
                            {slides[currentSlide].highlight}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right - Visual */}
                    <div className="flex-1 flex items-center justify-center lg:pl-4">
                      {slides[currentSlide].image ? (
                        <img 
                          src={slides[currentSlide].image} 
                          alt={slides[currentSlide].title}
                          className="max-w-full max-h-[280px] rounded-xl shadow-2xl"
                        />
                      ) : (
                        <div 
                          className="w-full h-[220px] md:h-[280px] rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(145deg, hsl(160 25% 12%) 0%, hsl(150 20% 8%) 100%)',
                            border: '1px solid hsl(160 30% 20% / 0.5)',
                          }}
                        >
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                              style={{
                                background: 'linear-gradient(135deg, hsl(160 50% 25%) 0%, hsl(150 40% 20%) 100%)',
                                boxShadow: '0 8px 25px hsl(160 40% 20% / 0.4)',
                              }}
                            >
                              <span 
                                className="text-3xl font-bold"
                                style={{ color: 'hsl(160 60% 70%)' }}
                              >
                                {currentSlide + 1}
                              </span>
                            </div>
                            <p style={{ color: 'hsl(160 20% 50%)', fontSize: '0.875rem' }}>
                              Demo visualization
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{
                  background: 'hsl(160 25% 15% / 0.9)',
                  color: 'hsl(160 30% 80%)',
                  border: '1px solid hsl(160 30% 25% / 0.5)',
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2"
                style={{
                  background: 'hsl(160 25% 15% / 0.9)',
                  color: 'hsl(160 30% 80%)',
                  border: '1px solid hsl(160 30% 25% / 0.5)',
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Bottom controls */}
            <div 
              className="px-8 py-5 flex items-center justify-between"
              style={{
                borderTop: '1px solid hsl(160 30% 18% / 0.5)',
                background: 'hsl(160 25% 6% / 0.5)',
              }}
            >
              {/* Dots */}
              <div className="flex gap-2" role="tablist" aria-label="Carousel navigation">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    role="tab"
                    aria-selected={index === currentSlide}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none",
                      index === currentSlide ? "w-8" : "w-2.5 hover:opacity-80"
                    )}
                    style={{
                      background: index === currentSlide 
                        ? 'linear-gradient(90deg, hsl(160 60% 50%), hsl(150 50% 45%))'
                        : 'hsl(160 30% 30% / 0.6)',
                      boxShadow: index === currentSlide 
                        ? '0 0 12px hsl(160 50% 40% / 0.5)' 
                        : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                aria-label={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'hsl(160 25% 15% / 0.6)',
                  color: 'hsl(160 30% 70%)',
                  border: '1px solid hsl(160 30% 25% / 0.4)',
                }}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="mt-4 h-1 rounded-full overflow-hidden"
            style={{ background: 'hsl(160 25% 15%)' }}
          >
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, hsl(160 60% 45%), hsl(150 50% 40%))',
                boxShadow: '0 0 10px hsl(160 50% 40% / 0.5)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
