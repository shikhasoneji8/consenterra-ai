import { motion } from "framer-motion";
import { Clock, Tag, Sparkles, Shield, Users, Zap } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";

interface ChangelogEntry {
  date: string;
  version?: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'security' | 'fix';
  items?: string[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "January 15, 2026",
    version: "2.1.0",
    title: "Guest Usage Limits & Smart Prompts",
    description: "Better experience for new users with gentle upgrade nudges.",
    type: "feature",
    items: [
      "2 free scans for unauthenticated users",
      "Persistent usage tracking across sessions",
      "Smart inline upgrade prompts (non-intrusive)",
      "Backend validation for guest limits",
    ],
  },
  {
    date: "January 10, 2026",
    version: "2.0.5",
    title: "Browser Extension Preview",
    description: "Analyze privacy policies directly in your browser.",
    type: "feature",
    items: [
      "Chrome extension with real-time scanning",
      "One-click policy analysis on any website",
      "PDF export for scan results",
      "Copy report to clipboard",
    ],
  },
  {
    date: "December 28, 2025",
    version: "2.0.0",
    title: "Subscription Tiers Launch",
    description: "Flexible plans for individuals and teams.",
    type: "feature",
    items: [
      "Free tier with 2 monthly scans",
      "Pro tier with unlimited scans",
      "Enterprise tier with API access",
      "Secure payment processing",
    ],
  },
  {
    date: "December 15, 2025",
    version: "1.5.0",
    title: "Scan History & Export",
    description: "View and manage your past analyses.",
    type: "feature",
    items: [
      "Persistent scan history for logged-in users",
      "Export reports as PDF",
      "Delete old scans",
      "Quick re-scan functionality",
    ],
  },
  {
    date: "December 1, 2025",
    version: "1.4.2",
    title: "Enhanced Dark Pattern Detection",
    description: "Better accuracy in identifying manipulative UI patterns.",
    type: "improvement",
    items: [
      "Improved detection algorithms",
      "More detailed evidence reporting",
      "Confidence scoring for findings",
    ],
  },
  {
    date: "November 20, 2025",
    version: "1.4.0",
    title: "Security & Performance Updates",
    description: "Backend hardening and faster scans.",
    type: "security",
    items: [
      "Row-level security on all tables",
      "Rate limiting for API endpoints",
      "30% faster scan times",
      "Improved error handling",
    ],
  },
];

const getTypeIcon = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'feature': return Sparkles;
    case 'improvement': return Zap;
    case 'security': return Shield;
    case 'fix': return Tag;
    default: return Tag;
  }
};

const getTypeColor = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'feature': return 'text-primary bg-primary/10 border-primary/20';
    case 'improvement': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'security': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'fix': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    default: return 'text-muted-foreground bg-muted/10 border-border';
  }
};

export default function Changelog() {
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
              <Clock className="h-4 w-4" />
              Changelog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6">
              What's New
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Every update, improvement, and fix—documented for transparency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <AnimatedSection className="py-16">
        <div className="section-container max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
            
            <div className="space-y-8">
              {changelog.map((entry, index) => {
                const TypeIcon = getTypeIcon(entry.type);
                const typeColor = getTypeColor(entry.type);
                
                return (
                  <motion.div
                    key={entry.date + entry.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-12 md:pl-20"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-2 md:left-6 top-2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/20" />
                    
                    <div 
                      className="p-6 rounded-2xl"
                      style={{
                        background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                        {entry.version && (
                          <span className="px-2 py-0.5 text-xs font-mono bg-muted rounded-full">
                            v{entry.version}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full border ${typeColor}`}>
                          <TypeIcon className="h-3 w-3" />
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                        </span>
                      </div>
                      
                      {/* Title & Description */}
                      <h3 className="text-lg font-semibold text-foreground mb-2">{entry.title}</h3>
                      <p className="text-muted-foreground mb-4">{entry.description}</p>
                      
                      {/* Items */}
                      {entry.items && (
                        <ul className="space-y-2">
                          {entry.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="text-primary mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
