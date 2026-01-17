import { useState } from "react";
import { Shield } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import AnimatedSection from "@/components/AnimatedSection";
import ScanInput from "./ScanInput";
import ScanProgress from "./ScanProgress";
import ScanResults from "./ScanResults";
import type { ScanResult, ScanStatus } from "@/types/scan";

export default function WebsiteRiskScan() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);

  const saveScanToHistory = async (scanResult: ScanResult) => {
    if (!user) return;
    
    try {
      // Using type assertion since scan_history table was just created
      const { error } = await supabase.from('scan_history' as 'profiles').insert({
        user_id: user.id,
        url: scanResult.domain,
        risk_score: scanResult.score,
        risk_level: scanResult.risk_level,
        summary: scanResult.summary,
        findings: {
          immediate_risks: scanResult.immediate_risks,
          dark_patterns: scanResult.dark_patterns,
          digital_footprint: scanResult.digital_footprint,
          actions: scanResult.actions,
          confidence: scanResult.confidence
        }
      } as never);

      if (error) {
        console.error('Failed to save scan history:', error);
      }
    } catch (err) {
      console.error('Error saving scan history:', err);
    }
  };

  const handleScan = async (url: string) => {
    setStatus('scanning');
    setProgressStep(0);
    setResult(null);

    try {
      // Simulate progress steps
      const progressTimer1 = setTimeout(() => setProgressStep(1), 1500);
      const progressTimer2 = setTimeout(() => setProgressStep(2), 3000);

      const { data, error } = await supabase.functions.invoke('website-scan', {
        body: { url }
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);

      if (error) {
        console.error('Scan error:', error);
        
        // Handle specific error codes
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes('402')) {
          toast.error("Service limit reached. Please try again later.");
        } else {
          toast.error("We couldn't scan this site. Try again or use demo scan.");
        }
        setStatus('error');
        return;
      }

      if (data && data.domain) {
        const scanResult = data as ScanResult;
        setResult(scanResult);
        setStatus('complete');
        
        // Save to history for logged-in users
        await saveScanToHistory(scanResult);
      } else {
        toast.error("We couldn't scan this site. Try again or use demo scan.");
        setStatus('error');
      }
    } catch (err) {
      console.error('Scan error:', err);
      toast.error("We couldn't scan this site. Try again or use demo scan.");
      setStatus('error');
    }
  };

  const handleScanAnother = () => {
    setStatus('idle');
    setResult(null);
    setProgressStep(0);
  };

  return (
    <AnimatedSection className="py-16 lg:py-20">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-4">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Instant Website Risk Scan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One click. Clear answers. No legalese.
            <br />
            <span className="text-foreground/70">Paste a site. We'll flag risks, dark patterns, and data collection habits.</span>
          </p>
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <ScanInput key="input" onScan={handleScan} isLoading={false} />
          )}
          
          {status === 'scanning' && (
            <ScanProgress key="progress" step={progressStep} />
          )}
          
          {status === 'complete' && result && (
            <ScanResults key="results" result={result} onScanAnother={handleScanAnother} />
          )}
          
          {status === 'error' && (
            <ScanInput key="input-error" onScan={handleScan} isLoading={false} />
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}
