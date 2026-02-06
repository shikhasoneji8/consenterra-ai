import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Zap, Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";

const features = [
  { 
    icon: Shield, 
    title: "Policy Risk Breakdown", 
    description: "Instantly see what’s good, bad, and risky in any privacy policy." 
  },
  { 
    icon: Brain, 
    title: "PrivBERT + Explanations", 
    description: "AI-powered classification with explainability to support user trust." 
  },
  { 
    icon: Eye, 
    title: "Sentence-Level Highlighting", 
    description: "See which exact lines map to each privacy practice category." 
  },
  { 
    icon: Zap, 
    title: "Fast, Practical, Actionable", 
    description: "Skip the legal wall of text, get straight to what matters." 
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Paste a policy URL or text",
    description:
      "Drop in any privacy policy link or paste the text directly. PriXplainer supports real-world, messy policies.",
  },
  {
    step: "02",
    title: "Get instant analysis",
    description:
      "We classify policy statements into privacy categories and severity using a research-backed model.",
  },
  {
    step: "03",
    title: "Explore why it’s risky",
    description:
      "Dive into explainability to understand what drove the model’s decisions and what it means for you.",
  },
];

const useCases = [
  {
    title: "Everyday Users",
    description: "Know what you're agreeing to before you hit “Accept.”",
    icon: Sparkles,
  },
  {
    title: "Founders & Product Teams",
    description: "Spot risk hotspots before shipping policies to users.",
    icon: Zap,
  },
  {
    title: "Researchers",
    description: "Analyze policy patterns at scale with structured outputs.",
    icon: Brain,
  },
];

export default function PriXplainer() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <AuroraBackground>
        <div className="section-container py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                <Shield className="h-4 w-4 text-primary" />
                Privacy policy clarity, powered by AI
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
                PriXplainer
                <span className="text-primary"> makes privacy policies readable</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Upload or paste any privacy policy and instantly see what it collects, what it shares, and what’s risky,
                with sentence-level explanations powered by PrivBERT.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="#try">
                    Try it now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Talk to us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">What PriXplainer does</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Built for speed, clarity, and trust. No jargon. No guessing.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <AnimatedSection key={f.title}>
                <GlowCard className="h-full p-6">
                  <f.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Three steps from “wall of text” to “I get it.”
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <AnimatedSection key={item.step}>
                <GlowCard className="h-full p-6">
                  <div className="text-primary font-bold text-sm">{item.step}</div>
                  <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">Who it’s for</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                If you’ve ever wondered “what did I just agree to?”, this is for you.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {useCases.map((u) => (
              <AnimatedSection key={u.title}>
                <GlowCard className="h-full p-6">
                  <u.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-lg">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.description}</p>
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Scanner Tool */}
      <section className="bg-gradient-to-b from-background via-primary/5 to-background py-10" id="try">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <GlowCard className="p-4 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Try PriXplainer</h2>
                  <p className="text-sm text-muted-foreground">
                    Embedded live from our Hugging Face deployment (no API calls needed).
                  </p>
                </div>
                <Button asChild variant="outline">
                  <a
                    href="https://shikhasoneji8-privacywhisper.hf.space"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Fullscreen <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-background">
                <div className="w-full" style={{ paddingTop: "62%" }} />
                <iframe
                  title="PriXplainer (Hugging Face)"
                  src="https://shikhasoneji8-privacywhisper.hf.space"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="clipboard-read; clipboard-write"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                If analysis takes time, it’s running on the Space queue. This page will not hang waiting for an API response.
              </p>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Extension CTA */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <AnimatedSection>
            <GlowCard className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Want this inside your browser?</h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                We’re building PriXplainer as a browser extension too, so you can get a privacy clarity overlay anywhere you browse.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Join the waitlist</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://shikhasoneji8-privacywhisper.hf.space" target="_blank" rel="noreferrer">
                    Try the demo <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Faster trust decisions</div>
                    <div className="text-sm text-muted-foreground">Know the risks before clicking accept.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Surface red flags</div>
                    <div className="text-sm text-muted-foreground">Highlight risky clauses in plain language.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">Explainable AI</div>
                    <div className="text-sm text-muted-foreground">See why the model made its call.</div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ConsenTerra. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" to="/privacy">
              Privacy
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/terms">
              Terms
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}