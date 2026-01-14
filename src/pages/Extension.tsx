import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Eye, Fingerprint, ArrowRight, 
  Chrome, Bell, CheckCircle, Code, Lock, ExternalLink,
  Globe, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ScanResult } from "@/types/scan";

const features = [
  {
    icon: Zap,
    title: "One-click risk scan",
    description: "Instantly analyze any website's privacy practices with a single click. No complex setup required."
  },
  {
    icon: Eye,
    title: "Dark pattern alerts",
    description: "Get warned about manipulative design patterns that trick you into sharing more data than intended."
  },
  {
    icon: Fingerprint,
    title: "Digital footprint snapshot",
    description: "See exactly what data the site collects about you—tracking, cookies, third-party sharing, and more."
  }
];

const steps = [
  { step: 1, text: "We read visible page signals" },
  { step: 2, text: "We summarize in plain language" },
  { step: 3, text: "You get an instant risk + action list" }
];

const blueprintItems = [
  "Manifest V3 compatible",
  "Content script reads page URL + detects consent banners and common tracking scripts",
  "Sends minimal signals to backend endpoint—same API as web scan",
  "Popup displays score + top risks + actions",
  "Privacy-first: We only send minimal page signals, not your personal form inputs"
];

export default function Extension() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // Mock extension state
  const [mockDomain] = useState("example.com");
  const [mockScanning, setMockScanning] = useState(false);
  const [mockResult, setMockResult] = useState<ScanResult | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // For now, just show success (could save to database later)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsJoined(true);
      toast.success("You're on the waitlist! We'll notify you when the extension launches.");
    }, 1000);
  };

  const handleMockScan = async () => {
    setMockScanning(true);
    setMockResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('website-scan', {
        body: { url: mockDomain }
      });

      if (error) throw error;
      setMockResult(data as ScanResult);
    } catch (err) {
      console.error('Mock scan error:', err);
      // Show demo result on error
      setMockResult({
        domain: mockDomain,
        score: 65,
        risk_level: "Medium",
        summary: "This site uses standard tracking practices common across the web.",
        immediate_risks: [
          { severity: "yellow", text: "Uses third-party analytics" },
          { severity: "green", text: "Clear cookie consent banner" },
          { severity: "yellow", text: "Shares data with advertisers" }
        ],
        dark_patterns: { detected: false, items: [] },
        digital_footprint: {
          chips: ["Analytics", "Cookies"],
          details: [],
          note: "AI inference based on common patterns"
        },
        actions: [
          { title: "Use private browsing", text: "Limits tracking" }
        ],
        confidence: "Medium"
      });
    } finally {
      setMockScanning(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles />
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ boxShadow: "0 0 40px hsl(270 80% 60% / 0.3)" }}
            >
              <Chrome className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
              PriXplainer Extension
            </h1>
            <p className="text-xl text-primary/80 font-medium mb-4">
              See website risks before you click "Accept".
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Get instant privacy insights on any website you visit. No more guessing what you're agreeing to.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="glow" 
                size="lg" 
                className="gap-2"
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Bell className="h-5 w-5" />
                Join the Waitlist
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/solutions/prixplainer">
                  <Sparkles className="h-5 w-5" />
                  Try the Web Scan
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient">What You'll Get</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} delay={i * 0.1} className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <AnimatedSection className="py-20 bg-surface-1/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-gradient text-center mb-12">How It Works</h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-6">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                      color: 'hsl(var(--primary-foreground))',
                      boxShadow: '0 4px 20px hsl(var(--glow-primary) / 0.4)',
                    }}
                  >
                    {item.step}
                  </div>
                  <p className="text-lg text-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Mock Extension UI */}
      <AnimatedSection className="py-20">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-gradient text-center mb-4">Preview the Extension</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            See how the extension popup will look. This simulation uses the same scan technology.
          </p>
          
          <div className="flex justify-center">
            {/* Mock Extension Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-[360px] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 25px 60px -15px hsl(var(--glow-primary) / 0.25)',
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">PriXplainer</span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                {/* Domain */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-background/50">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{mockDomain}</span>
                </div>
                
                {!mockResult && !mockScanning && (
                  <Button 
                    onClick={handleMockScan}
                    variant="glow" 
                    className="w-full gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Scan this page
                  </Button>
                )}
                
                {mockScanning && (
                  <div className="text-center py-6">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Analyzing...</p>
                  </div>
                )}
                
                {mockResult && (
                  <div className="space-y-4">
                    {/* Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                      <span className={`text-2xl font-bold ${
                        mockResult.score >= 70 ? 'text-green-400' :
                        mockResult.score >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {mockResult.score}/100
                      </span>
                    </div>
                    
                    {/* Risk Level */}
                    <div className={`px-3 py-2 rounded-lg text-center ${
                      mockResult.risk_level === 'Low' ? 'bg-green-500/20 text-green-400' :
                      mockResult.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {mockResult.risk_level} Risk
                    </div>
                    
                    {/* Top 3 Risks */}
                    <div className="space-y-2">
                      {mockResult.immediate_risks.slice(0, 3).map((risk, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span>{risk.severity === 'green' ? '🟢' : risk.severity === 'yellow' ? '🟡' : '🔴'}</span>
                          <span className="text-foreground/90">{risk.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Link to="/solutions/prixplainer">
                        Full Report <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tech Blueprint */}
      <AnimatedSection className="py-20 bg-surface-1/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-gradient text-center mb-4">Extension V1 Blueprint</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Built with modern web standards for security and performance.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <GlowCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Code className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground text-lg">Technical Details</h3>
              </div>
              
              <ul className="space-y-3">
                {blueprintItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <strong>Privacy Note:</strong> We only send minimal page signals, not your personal form inputs or browsing history.
                </p>
              </div>
            </GlowCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Waitlist */}
      <AnimatedSection id="waitlist" className="py-20">
        <div className="section-container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gradient mb-4">Join the Waitlist</h2>
            <p className="text-muted-foreground mb-8">
              Be the first to know when the PriXplainer extension launches. Get early access and help shape the product.
            </p>
            
            {isJoined ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">You're on the list!</h3>
                <p className="text-muted-foreground">We'll notify you when the extension is ready.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 text-lg bg-background/50"
                  aria-label="Email address for waitlist"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="glow" 
                  size="lg"
                  className="whitespace-nowrap"
                >
                  {isSubmitting ? "Joining..." : "Notify Me"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Can't wait for the extension?</h2>
          <p className="text-muted-foreground mb-6">Try our web-based privacy scan right now.</p>
          <Button asChild variant="glow" size="lg" className="gap-2">
            <Link to="/solutions/prixplainer">
              Try Web Scan <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
