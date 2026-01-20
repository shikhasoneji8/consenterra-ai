import { useState } from "react";
import { Search, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ScanInputProps {
  onScan: (url: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

export default function ScanInput({ onScan, isLoading, disabled = false, onDisabledClick }: ScanInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return "Please enter a website URL";
    
    // Simple domain validation
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
    
    if (!domainPattern.test(trimmed) && !urlPattern.test(trimmed)) {
      return "Please enter a valid site like example.com";
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onScan(url.trim());
  };

  const handleDemoScan = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    setUrl("facebook.com");
    setError("");
    onScan("facebook.com");
  };

  const handleButtonClick = () => {
    if (disabled) {
      onDisabledClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div 
        className="p-6 md:p-8 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 20px 50px -15px hsl(var(--glow-primary) / 0.15)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
                className="pl-12 h-14 text-lg bg-background/50 border-border focus:border-primary"
                aria-label="Website URL to scan"
                aria-invalid={!!error}
                aria-describedby={error ? "url-error" : undefined}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleButtonClick}
              variant={disabled ? "secondary" : "glow"}
              size="lg"
              className={`h-14 px-8 text-lg font-semibold whitespace-nowrap ${disabled ? 'opacity-75 cursor-not-allowed' : 'spark-hover'}`}
            >
              {disabled ? (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Limit Reached
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <p id="url-error" className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          {disabled && (
            <p className="text-sm text-center text-muted-foreground">
              You've used your 2 free scans. <button type="button" onClick={onDisabledClick} className="text-primary hover:underline font-medium">Sign up to continue</button>
            </p>
          )}
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDemoScan}
            disabled={isLoading}
            className={`text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Try a demo scan
          </button>
        </div>
      </div>
    </motion.div>
  );
}
