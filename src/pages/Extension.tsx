import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Eye, Fingerprint, ArrowRight, 
  Chrome, Bell, CheckCircle, Code, Lock, ExternalLink,
  Globe, Sparkles, Download, Settings, Puzzle, MonitorUp,
  MousePointer, FileSearch, BarChart3
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
    title: "One-Click Privacy Scan",
    description: "Instantly analyze any website's privacy practices with a single click. No complex setup required."
  },
  {
    icon: Eye,
    title: "Dark Pattern Detection",
    description: "Get warned about manipulative design patterns that trick you into sharing more data than intended."
  },
  {
    icon: Fingerprint,
    title: "Digital Footprint Snapshot",
    description: "See exactly what data the site collects—tracking, cookies, third-party sharing, and more."
  },
  {
    icon: BarChart3,
    title: "Trust Score Rating",
    description: "Get a clear 0-100 score that tells you at a glance how trustworthy a website's privacy practices are."
  }
];

const installationSteps = [
  {
    step: 1,
    title: "Download the Extension",
    description: "Click the download button to get the extension files, or clone from our repository.",
    icon: Download
  },
  {
    step: 2,
    title: "Open Chrome Extensions",
    description: "Navigate to chrome://extensions/ in your browser and enable Developer mode in the top-right corner.",
    icon: Settings
  },
  {
    step: 3,
    title: "Load Unpacked Extension",
    description: "Click 'Load unpacked' and select the browser-extension folder you downloaded.",
    icon: MonitorUp
  },
  {
    step: 4,
    title: "Pin to Toolbar",
    description: "Click the puzzle icon in Chrome's toolbar, find PriXplainer, and pin it for easy access.",
    icon: Puzzle
  }
];

const howItWorks = [
  { 
    step: 1, 
    title: "Visit Any Website",
    description: "Navigate to any website you want to analyze",
    icon: Globe 
  },
  { 
    step: 2, 
    title: "Click the Extension",
    description: "One click to start the privacy scan",
    icon: MousePointer 
  },
  { 
    step: 3, 
    title: "Get Instant Results",
    description: "See your trust score, risks, and recommendations",
    icon: FileSearch 
  }
];

const blueprintItems = [
  "Manifest V3 compatible for modern Chrome security",
  "Content script reads page URL + detects consent banners",
  "Minimal data sent to backend—only domain name",
  "Same powerful AI analysis as our web scanner",
  "No browsing history or personal data collected"
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
      {/* Hero Section - Enhanced */}
      <section className="min-h-[85vh] py-20 lg:py-28 relative overflow-hidden flex items-center">
        <AuroraBackground showParticles />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Chrome className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Chrome Extension</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                <span className="text-foreground">Privacy insights</span>
                <br />
                <span className="text-gradient">in every tab</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                See website risks before you click "Accept". Get instant privacy analysis 
                on any website you visit—no more guessing what you're agreeing to.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="glow" 
                  size="lg" 
                  className="gap-2 text-lg px-8"
                  onClick={() => document.getElementById('installation')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Download className="h-5 w-5" />
                  Install Extension
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/solutions/prixplainer">
                    <Sparkles className="h-5 w-5" />
                    Try Web Scan First
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Privacy-first</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Extension Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 blur-3xl opacity-30"
                  style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
                />
                
                {/* Mock Extension Popup */}
                <motion.div
                  className="relative w-[320px] sm:w-[360px] rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 25px 60px -15px hsl(var(--glow-primary) / 0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-background/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">PriXplainer</span>
                    <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">v1.0</span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Domain */}
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-background/50 border border-border/50">
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
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Analyzing privacy practices...</p>
                      </div>
                    )}
                    
                    {mockResult && (
                      <div className="space-y-4">
                        {/* Score */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                          <span className="text-sm text-muted-foreground">Trust Score</span>
                          <span className={`text-3xl font-bold ${
                            mockResult.score >= 70 ? 'text-green-400' :
                            mockResult.score >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {mockResult.score}/100
                          </span>
                        </div>
                        
                        {/* Risk Level */}
                        <div className={`px-4 py-3 rounded-lg text-center font-medium ${
                          mockResult.risk_level === 'Low' ? 'bg-green-500/20 text-green-400' :
                          mockResult.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {mockResult.risk_level} Risk
                        </div>
                        
                        {/* Top Risks */}
                        <div className="space-y-2">
                          {mockResult.immediate_risks.slice(0, 3).map((risk, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-background/20">
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
                            View Full Report <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-24 bg-surface-1/30">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand website privacy practices at a glance.
            </p>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} delay={i * 0.1} className="p-6">
                <motion.div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <AnimatedSection className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Privacy scanning made simple. Just three easy steps.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                  
                  <motion.div 
                    className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 relative"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2) 0%, hsl(var(--accent) / 0.1) 100%)',
                      boxShadow: '0 8px 32px hsl(var(--glow-primary) / 0.2)',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <item.icon className="h-10 w-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {item.step}
                    </div>
                  </motion.div>
                  
                  <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Installation Guide - Enhanced */}
      <AnimatedSection id="installation" className="py-24 bg-surface-1/50">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Developer Mode Installation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Install the Extension</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to install PriXplainer on your Chrome browser.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {installationSteps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlowCard className="p-6 h-full">
                    <div className="flex gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                          boxShadow: '0 4px 20px hsl(var(--glow-primary) / 0.4)',
                        }}
                      >
                        <item.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Step {item.step}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Chrome URL Helper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <GlowCard className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <Chrome className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-foreground font-medium mb-1">Quick Access</p>
                    <p className="text-sm text-muted-foreground">
                      Copy this URL and paste it in Chrome's address bar:
                    </p>
                  </div>
                  <code className="px-4 py-2 bg-background/50 rounded-lg text-primary font-mono text-sm border border-border">
                    chrome://extensions/
                  </code>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tech Blueprint */}
      <AnimatedSection className="py-24">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">Built for Privacy</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We practice what we preach. Here's how we protect your privacy.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <GlowCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-xl">Technical Details</h3>
              </div>
              
              <ul className="space-y-4">
                {blueprintItems.map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Privacy Promise</p>
                  <p className="text-sm text-muted-foreground">
                    We only send the domain name for analysis. We never collect your browsing history, 
                    form inputs, or any personal data.
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Waitlist Section */}
      <AnimatedSection id="waitlist" className="py-24 bg-surface-1/50">
        <div className="section-container">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Coming to Chrome Web Store</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gradient mb-4">Join the Waitlist</h2>
            <p className="text-muted-foreground mb-8">
              Be the first to know when PriXplainer is available on the Chrome Web Store. 
              Get early access and help shape the future of privacy browsing.
            </p>
            
            {isJoined ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">You're on the list!</h3>
                <p className="text-muted-foreground">We'll send you an email when the extension is ready.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-14 text-lg bg-background/50 border-border"
                  aria-label="Email address for waitlist"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="glow" 
                  size="lg"
                  className="h-14 px-8 whitespace-nowrap"
                >
                  {isSubmitting ? "Joining..." : "Get Notified"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="py-20">
        <div className="section-container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Can't wait for the extension?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Try our web-based privacy scanner right now. Same powerful analysis, no installation required.
          </p>
          <Button asChild variant="glow" size="lg" className="gap-2 text-lg px-8">
            <Link to="/solutions/prixplainer">
              Try Web Scan Now <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
