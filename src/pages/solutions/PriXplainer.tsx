import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Zap, Brain, Eye, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";

const HF_SPACE_BASE = "https://shikhasoneji8-privacywhisper.hf.space";
const HF_SPACE_EMBED_URL = `${HF_SPACE_BASE}/?__theme=dark&theme=dark&__dark=1`;

const features = [
  {
    icon: Brain,
    title: "PrivBERT AI Model",
    description: "Powered by a specialized transformer model trained on privacy policies.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Eye,
    title: "Risk Detection",
    description: "Visual severity indicators highlight concerning practices instantly.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get results in seconds, not the 18 minutes it takes to read manually.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "Plain Language",
    description: "No legal jargon, just clear explanations anyone can understand.",
    color: "from-emerald-500 to-teal-600",
  },
];

const useCases = [
  {
    title: "Everyday Users",
    description: "Know what you're agreeing to before you hit 'Accept.'",
    icon: Sparkles,
  },
  {
    title: "Founders & Product Teams",
    description: "Spot privacy risks early and build user trust.",
    icon: Zap,
  },
  {
    title: "Researchers",
    description: "Analyze policy patterns with explainable outputs.",
    icon: Brain,
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
    title: "Explore why it's risky",
    description:
      "Dive into explainability to understand what drove the model's decisions and what it means for you.",
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
                PriXplainer <span className="text-primary">makes privacy policies readable</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Upload or paste any privacy policy and instantly see what it collects, what it shares, and what's risky,
                with sentence-level explanations powered by PrivBERT.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <a href="#try">
                    Try it now <ArrowRight className="h-4 w-4" />
                  </a>
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
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">What PriXplainer does</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Built for speed, clarity, and trust. No jargon. No guessing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <GlowCard key={f.title} className="h-full p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How it works */}
      <AnimatedSection className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Three steps from "wall of text" to "I get it."
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <GlowCard key={item.step} className="h-full p-6">
                <div className="text-primary font-bold text-sm">{item.step}</div>
                <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Use cases */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Who it's for</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              If you've ever wondered "what did I just agree to?", this is for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {useCases.map((u) => (
              <GlowCard key={u.title} className="h-full p-6">
                <u.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold text-lg">{u.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Try PriXplainer - CLEAN MINIMAL IFRAME */}
      <section id="try" className="py-14 md:py-20">
        <div className="w-full px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Try PriXplainer
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Analyze any privacy policy instantly. Powered by PrivBERT AI.
                </p>
              </div>

              <Button asChild variant="outline" className="gap-2 w-fit">
                <a href={HF_SPACE_BASE} target="_blank" rel="noreferrer">
                  <Maximize2 className="h-4 w-4" />
                  Open Fullscreen
                </a>
              </Button>
            </div>
          </div>

          {/* Iframe Container - Clean, no glow effects */}
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl border border-border bg-[#0f0f14] overflow-hidden">
              {/* Iframe wrapper - crops top to hide "PrivacyWhisper" */}
              <div className="overflow-hidden" style={{ height: "820px" }}>
                <iframe
                  title="PriXplainer"
                  src={HF_SPACE_EMBED_URL}
                  className="w-full border-0"
                  style={{
                    height: "920px",
                    marginTop: "-85px",
                    background: "#0f0f14",
                  }}
                  loading="lazy"
                  allow="clipboard-read; clipboard-write"
                />
              </div>

              {/* Bottom bar - subtle */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/50 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
                <span>If loading is slow, the model may be warming up.</span>
                <a 
                  href={HF_SPACE_BASE} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-foreground transition-colors"
                >
                  Open in new tab →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extension CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto p-8 text-center rounded-2xl border border-border bg-muted/20">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Zap className="h-7 w-7 text-primary" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">Want this inside your browser?</h3>
            <p className="mt-3 text-muted-foreground">
              We're building PriXplainer as a browser extension so you can get privacy insights anywhere you browse.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/contact">Join the waitlist</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={HF_SPACE_BASE} target="_blank" rel="noreferrer">
                  Try the demo
                </a>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3 text-left text-sm">
              <div className="flex gap-3">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Faster decisions</div>
                  <div className="text-muted-foreground">Know risks before clicking accept.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Surface red flags</div>
                  <div className="text-muted-foreground">Highlight risky clauses plainly.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Explainable AI</div>
                  <div className="text-muted-foreground">See why the model decided.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-border py-10">
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
