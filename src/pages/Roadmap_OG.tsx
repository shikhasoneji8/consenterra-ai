import { motion } from "framer-motion";
import { Rocket, Wrench, Sparkles, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const roadmapItems = {
  shipped: [
    { title: "Guest Usage Limits", description: "2 free scans for non-authenticated users", date: "Jan 2026" },
    { title: "Browser Extension Preview", description: "Chrome extension for real-time policy analysis", date: "Jan 2026" },
    { title: "Subscription Tiers", description: "Free, Pro, and Enterprise plans launched", date: "Dec 2025" },
    { title: "Scan History", description: "View and export past scan results", date: "Dec 2025" },
  ],
  inProgress: [
    { title: "Persona-based Analysis", description: "View results as different user types", date: "Q1 2026" },
    { title: "Multi-language Support", description: "Analyze policies in 10+ languages", date: "Q1 2026" },
    { title: "API Access", description: "REST API for enterprise integrations", date: "Q1 2026" },
  ],
  comingSoon: [
    { title: "Policy Comparison", description: "Compare privacy policies side-by-side", date: "Q2 2026" },
    { title: "Automated Monitoring", description: "Get alerts when policies change", date: "Q2 2026" },
    { title: "Team Collaboration", description: "Share and annotate findings with your team", date: "Q3 2026" },
  ],
};

const StatusCard = ({ 
  title, 
  icon: Icon, 
  items, 
  color 
}: { 
  title: string; 
  icon: typeof Rocket; 
  items: { title: string; description: string; date: string }[];
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl"
    style={{
      background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
      border: '1px solid hsl(var(--border))',
    }}
  >
    <div className={`flex items-center gap-3 mb-6 ${color}`}>
      <div className={`p-2 rounded-lg bg-current/10`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
              {item.date}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default function Roadmap() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Product Roadmap
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6">
              What We're Building
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparency isn't just our product—it's how we build. 
              See what's shipped, in progress, and coming next.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Grid */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <StatusCard 
              title="Recently Shipped" 
              icon={CheckCircle2} 
              items={roadmapItems.shipped}
              color="text-green-400"
            />
            <StatusCard 
              title="In Progress" 
              icon={Wrench} 
              items={roadmapItems.inProgress}
              color="text-yellow-400"
            />
            <StatusCard 
              title="Coming Soon" 
              icon={Sparkles} 
              items={roadmapItems.comingSoon}
              color="text-primary"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16 lg:py-24">
        <div className="section-container text-center">
          <div 
            className="p-8 md:p-12 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
              border: '1px solid hsl(var(--border))',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-4">
              Have a feature request?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We build for you. Tell us what would make privacy analysis more useful.
            </p>
            <Button variant="glow" size="lg" asChild>
              <Link to="/contact" className="gap-2">
                Share Your Ideas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
