import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Zap, Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import PriXplainerScanner from "@/components/scan/PriXplainerScanner";

const features = [
  { 
    icon: Brain,
    title: "PrivBERT AI Model", 
    description: "Powered by a specialized transformer model trained on privacy policies.",
    color: "from-violet-500 to-purple-600"
  },
  { 
    icon: Eye,
    title: "Risk Detection", 
    description: "Visual severity indicators highlight concerning practices instantly.",
    color: "from-rose-500 to-red-600"
  },
  { 
    icon: Zap,
    title: "Instant Analysis", 
    description: "Get results in seconds, not the 18 minutes it takes to read manually.",
    color: "from-amber-500 to-orange-600"
  },
  { 
    icon: Sparkles,
    title: "Plain Language", 
    description: "No legal jargon—just clear explanations anyone can understand.",
    color: "from-emerald-500 to-green-600"
  },
];

export default function PriXplainer() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles={true} />
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{ 
                boxShadow: ['0 0 30px hsl(270 80% 60% / 0.3)', '0 0 60px hsl(270 80% 60% / 0.5)', '0 0 30px hsl(270 80% 60% / 0.3)']
              }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Privacy Analysis</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-gradient">PriXplainer</span>
            </h1>
            <p className="text-xl sm:text-2xl text-primary/80 font-semibold mb-4">
              Understand before you consent.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Stop blindly clicking "I Agree". Our AI reads privacy policies so you don't have to, 
              revealing hidden data practices in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-border/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "90%", label: "Users accept without reading" },
              { value: "18 min", label: "Average policy read time" },
              { value: "70+", label: "Third parties per session" },
              { value: "<30s", label: "PriXplainer analysis time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-black text-gradient">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-6 md:p-8 border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">The Hidden Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Privacy policies are intentionally complex. Companies bury concerning data practices 
                  in walls of legal text, knowing you won't read them. Your personal data becomes 
                  a product sold to advertisers, data brokers, and third parties you've never heard of.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* Features */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient">PriXplainer</span> Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Advanced AI that understands privacy policies better than most humans.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard className="p-6 h-full hover:scale-105 transition-transform">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scanner Tool */}
      <div className="bg-gradient-to-b from-background via-primary/5 to-background">
        <PriXplainerScanner />
      </div>

      {/* Extension CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Coming Soon: Browser Extension</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get instant privacy insights on every website you visit. See risk scores before you click "Accept".
            </p>
            <Button asChild variant="glow" size="lg">
              <Link to="/extension">
                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to take control of your <span className="text-gradient">privacy</span>?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Questions about PriXplainer or want to integrate it into your business?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="glow" size="lg">
              <Link to="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/solutions">View All Solutions</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
