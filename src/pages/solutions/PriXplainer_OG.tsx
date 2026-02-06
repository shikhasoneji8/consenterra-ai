import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoCarousel from "@/components/DemoCarousel";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import WebsiteRiskScan from "@/components/scan/WebsiteRiskScan";
import ScanHistory from "@/components/scan/ScanHistory";

const demoSlides = [
  {
    title: "Paste Any Privacy Policy",
    description: "Simply paste the URL or text of any privacy policy or terms of service. PriXplainer works with policies from any website or app.",
    bullets: [
      "Works with any website or app policy",
      "Supports URLs or direct text paste",
      "Handles policies of any length"
    ],
    highlight: "Works with policies from Google, Facebook, Instagram, and thousands of other services."
  },
  {
    title: "AI-Powered Analysis",
    description: "Our advanced AI engine reads and analyzes the entire document, identifying key clauses about data collection, sharing, and your rights.",
    bullets: [
      "Identifies data collection practices",
      "Flags third-party sharing",
      "Highlights your rights and opt-outs"
    ],
    highlight: "Powered by privacy-focused ontologies developed by legal and privacy experts."
  },
  {
    title: "See Risk Indicators",
    description: "Visual severity indicators highlight concerning practices at a glance. Red flags for high-risk clauses, yellow for moderate concerns, and green for user-friendly terms.",
    bullets: [
      "🔴 High-risk clauses flagged in red",
      "🟡 Moderate concerns in yellow",
      "🟢 User-friendly terms in green"
    ],
    highlight: "Each risk is explained in plain language so you understand exactly what it means for you."
  },
  {
    title: "Get Your Summary",
    description: "Receive a clear, human-readable summary of what the policy actually says about your data. No more legal jargon—just the facts you need to make informed decisions.",
    bullets: [
      "Plain-language explanations",
      "Key points highlighted",
      "Actionable recommendations"
    ],
    highlight: "Typical 18-minute read condensed to 2 minutes of actionable insights."
  }
];

const features = [
  { title: "AI-Generated Summaries", description: "Get clear, concise summaries of privacy policies without legal jargon." },
  { title: "Risk Indicators", description: "Visual risk and severity indicators highlight concerning practices." },
  { title: "Ontology-Based Classification", description: "Advanced clause classification powered by privacy-focused ontologies." },
  { title: "Human-Readable Insights", description: "User-centric explanations anyone can understand." },
];

export default function PriXplainer() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles={false} />
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
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">PriXplainer</h1>
            <p className="text-xl text-primary/80 font-medium mb-4">Understand before you consent.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              PriXplainer decodes privacy policies and terms of service using AI-driven analysis, 
              risk indicators, and human-readable summaries—making invisible data practices visible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-6 border-destructive/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Over 90% of users accept terms without reading them. The average privacy policy 
                  takes 18 minutes to read, and a single browsing session can share your data with 
                  70+ third parties. You deserve to know what you're agreeing to.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* Features */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient">Key Capabilities</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} delay={i * 0.1} className="p-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <DemoCarousel 
        slides={demoSlides} 
        title="See PriXplainer in Action" 
        subtitle="Discover how PriXplainer transforms complex privacy policies into clear, actionable insights." 
      />

      {/* Website Risk Scan Tool */}
      <WebsiteRiskScan />
      
      {/* Scan History for logged-in users */}
      <div className="section-container">
        <ScanHistory />
      </div>

      {/* Extension CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Coming Soon: Browser Extension</h3>
            <p className="text-muted-foreground mb-6">
              Get instant privacy insights on any website you visit. See risk scores before you click "Accept".
            </p>
            <Button asChild variant="glow">
              <Link to="/extension">
                Learn More & Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to understand your privacy?</h2>
          <p className="text-muted-foreground mb-6">Contact us to learn more about PriXplainer.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="glow">
              <Link to="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/solutions">View All Solutions</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
