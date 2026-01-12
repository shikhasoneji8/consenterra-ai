import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoSlide {
  title: string;
  description: string;
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
  accentColor = "primary"
}: DemoCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-border shadow-xl overflow-hidden">
            {/* Slides */}
            <div className="relative min-h-[400px] md:min-h-[450px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 p-8 md:p-12 transition-all duration-500",
                    index === currentSlide 
                      ? "opacity-100 translate-x-0" 
                      : index < currentSlide 
                        ? "opacity-0 -translate-x-full" 
                        : "opacity-0 translate-x-full"
                  )}
                >
                  <div className="flex flex-col md:flex-row gap-8 h-full">
                    {/* Left - Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit",
                        `bg-${accentColor}/10 text-${accentColor}`
                      )}>
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        Step {index + 1} of {slides.length}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {slide.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {slide.description}
                      </p>

                      {slide.highlight && (
                        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <p className="text-sm text-foreground font-medium">
                            💡 {slide.highlight}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right - Visual */}
                    <div className="flex-1 flex items-center justify-center">
                      {slide.image ? (
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="max-w-full max-h-[250px] rounded-xl shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-[200px] md:h-[250px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-border">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-3xl font-bold text-primary">{index + 1}</span>
                            </div>
                            <p className="text-muted-foreground text-sm">Demo visualization</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-primary w-8" 
                      : "bg-primary/30 hover:bg-primary/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
