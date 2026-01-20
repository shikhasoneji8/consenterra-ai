import { useState } from "react";
import { Shield } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useGuestUsage } from "@/hooks/useGuestUsage";
import AnimatedSection from "@/components/AnimatedSection";
import ScanInput from "./ScanInput";
import ScanProgress from "./ScanProgress";
import ScanResults from "./ScanResults";
import PaywallDialog from "@/components/PaywallDialog";
import GuestLimitModal from "@/components/GuestLimitModal";
import type { ScanResult, ScanStatus } from "@/types/scan";
import type { Json } from "@/integrations/supabase/types";
import type { PersonaType } from "./PersonaToggle";

// Check for dev bypass - only works on preview/localhost with ?dev=1
const isDevBypass = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  const isDevEnvironment = hostname === 'localhost' || 
                           hostname.includes('127.0.0.1') || 
                           hostname.includes('.lovable.app') ||
                           hostname.includes('preview');
  const hasDevParam = new URLSearchParams(window.location.search).get('dev') === '1';
  return isDevEnvironment && hasDevParam;
};

export default function WebsiteRiskScan() {
  const { user } = useAuth();
  const { scanCount, canScan, refreshSubscription } = useSubscription();
  const { remainingTries, canUseAsGuest, incrementUsage, getUsageToken } = useGuestUsage();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showGuestLimit, setShowGuestLimit] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('everyday');
  const [lastScannedUrl, setLastScannedUrl] = useState<string>('');
  const [isRescanningPersona, setIsRescanningPersona] = useState(false);
  
  const devMode = isDevBypass();

  const saveScanToHistory = async (scanResult: ScanResult) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('scan_history').insert([{
        user_id: user.id,
        url: scanResult.domain,
        risk_score: scanResult.score,
        risk_level: scanResult.risk_level,
        summary: scanResult.summary,
        findings: JSON.parse(JSON.stringify({
          immediate_risks: scanResult.immediate_risks,
          dark_patterns: scanResult.dark_patterns,
          digital_footprint: scanResult.digital_footprint,
          actions: scanResult.actions,
          confidence: scanResult.confidence
        })) as Json
      }]);

      if (error) {
        console.error('Failed to save scan history:', error);
      } else {
        // Refresh subscription to update scan count
        await refreshSubscription();
      }
    } catch (err) {
      console.error('Error saving scan history:', err);
    }
  };

  // Re-scan with different persona
  const handlePersonaChange = async (newPersona: PersonaType) => {
    if (newPersona === currentPersona || !lastScannedUrl) return;
    
    setCurrentPersona(newPersona);
    setIsRescanningPersona(true);
    
    try {
      const requestBody: { url: string; guest_token?: string; persona: PersonaType; is_persona_rescan: boolean } = { 
        url: lastScannedUrl,
        persona: newPersona,
        is_persona_rescan: true // Flag to skip guest limit check for persona changes
      };
      if (!user) {
        requestBody.guest_token = getUsageToken();
      }

      const { data, error } = await supabase.functions.invoke('website-scan', {
        body: requestBody
      });

      if (error) {
        console.error('Persona rescan error:', error);
        toast.error("Couldn't refresh analysis. Please try again.");
        setIsRescanningPersona(false);
        return;
      }

      if (data && data.domain) {
        setResult(data as ScanResult);
        toast.success(`Analysis updated for ${newPersona === 'everyday' ? 'Everyday User' : newPersona === 'privacy' ? 'Privacy-conscious' : 'Business'} view`);
      }
    } catch (err) {
      console.error('Persona rescan error:', err);
      toast.error("Couldn't refresh analysis. Please try again.");
    } finally {
      setIsRescanningPersona(false);
    }
  };

  const handleScan = async (url: string, personaOverride?: PersonaType) => {
    const persona = personaOverride || currentPersona;
    
    // Skip limits in dev mode
    if (!devMode) {
      // For unauthenticated users, check guest limit
      if (!user) {
        if (!canUseAsGuest) {
          setShowGuestLimit(true);
          return;
        }
      } else {
        // For authenticated users, check subscription scan limit
        if (!canScan) {
          setShowPaywall(true);
          return;
        }
      }
    }

    setStatus('scanning');
    setProgressStep(0);
    setResult(null);
    setLastScannedUrl(url);

    try {
      // Simulate progress steps
      const progressTimer1 = setTimeout(() => setProgressStep(1), 1500);
      const progressTimer2 = setTimeout(() => setProgressStep(2), 3000);

      // Include guest usage token, persona, and dev mode for backend
      const requestBody: { url: string; guest_token?: string; persona: PersonaType; dev_bypass?: boolean } = { 
        url,
        persona
      };
      if (devMode) {
        requestBody.dev_bypass = true;
      } else if (!user) {
        requestBody.guest_token = getUsageToken();
      }

      const { data, error } = await supabase.functions.invoke('website-scan', {
        body: requestBody
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
        } else if (error.message?.includes('403') || error.message?.includes('guest_limit')) {
          // Backend rejected due to guest limit
          setShowGuestLimit(true);
          setStatus('idle');
          return;
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
        
        // For guests, increment usage count after successful scan
        if (!user) {
          incrementUsage();
        } else {
          // Save to history for logged-in users
          await saveScanToHistory(scanResult);
        }
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
    setLastScannedUrl('');
  };

  // Determine if the scan button should be disabled (never disabled in dev mode)
  const isScanDisabled = !devMode && !user && !canUseAsGuest;

  return (
    <>
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
            {/* Usage counter */}
            {user ? (
              <p className="text-sm text-muted-foreground mt-2">
                Scans used: {scanCount} / {canScan ? "∞" : "2"}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                {remainingTries > 0 ? (
                  <>Free tries remaining: <span className="font-semibold text-primary">{remainingTries}</span></>
                ) : (
                  <span className="text-destructive font-medium">Free tries used — Sign up to continue</span>
                )}
              </p>
            )}
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <ScanInput 
                key="input" 
                onScan={handleScan} 
                isLoading={false} 
                disabled={isScanDisabled}
                onDisabledClick={() => setShowGuestLimit(true)}
              />
            )}
            
            {status === 'scanning' && (
              <ScanProgress key="progress" step={progressStep} />
            )}
            
            {status === 'complete' && result && (
              <ScanResults 
                key="results" 
                result={result} 
                onScanAnother={handleScanAnother}
                persona={currentPersona}
                onPersonaChange={handlePersonaChange}
                isLoadingPersona={isRescanningPersona}
              />
            )}
            
            {status === 'error' && (
              <ScanInput 
                key="input-error" 
                onScan={handleScan} 
                isLoading={false}
                disabled={isScanDisabled}
                onDisabledClick={() => setShowGuestLimit(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </AnimatedSection>

      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall} 
        scanCount={scanCount}
      />

      <GuestLimitModal
        open={showGuestLimit}
        onOpenChange={setShowGuestLimit}
      />
    </>
  );
}
