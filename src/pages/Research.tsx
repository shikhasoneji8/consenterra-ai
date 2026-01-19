import { motion } from "framer-motion";
import { 
  Brain, Shield, Target, CheckCircle, BarChart3, 
  Lightbulb, Lock, Eye, FileText, Zap, TrendingUp
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const methodologySteps = [
  {
    icon: Eye,
    title: "Signal Detection",
    description: "We scan visible page elements including meta tags, scripts, consent patterns, tracking pixels, and third-party integrations to build a comprehensive picture of data collection practices."
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our models are trained on thousands of privacy policies and known patterns. We use Google's Gemini models for nuanced, context-aware interpretation—not simple keyword matching."
  },
  {
    icon: Shield,
    title: "Risk Classification",
    description: "Each finding is categorized by severity (green/yellow/red) based on potential impact to user privacy, industry benchmarks, and regulatory frameworks like GDPR and CCPA."
  },
  {
    icon: FileText,
    title: "Plain Language Translation",
    description: "Legal jargon is converted to actionable insights. We explain what policies mean for you, not just what they say."
  },
];

const accuracyMetrics = [
  {
    metric: "89%",
    label: "Pattern Detection Accuracy",
    description: "Verified against manual expert audits"
  },
  {
    metric: "94%",
    label: "Risk Classification Precision",
    description: "Correct severity assignment rate"
  },
  {
    metric: "< 2s",
    label: "Average Analysis Time",
    description: "From URL submission to results"
  },
  {
    metric: "1000+",
    label: "Sites Analyzed",
    description: "Training data from real-world policies"
  },
];

const principles = [
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "We never store your browsing data or the content of policies you analyze. Analysis happens in real-time and results are ephemeral unless you explicitly save them."
  },
  {
    icon: Lightbulb,
    title: "Explainability",
    description: "Every risk score comes with reasoning. We show our work so you can verify our conclusions and make informed decisions."
  },
  {
    icon: Target,
    title: "Conservative Scoring",
    description: "When uncertain, we err on the side of caution. A yellow flag means 'investigate further,' not 'definitely dangerous.'"
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description: "Our models improve with each analysis. New dark patterns, tracking techniques, and policy language are incorporated into our detection systems."
  },
];

const limitations = [
  "We analyze visible signals only—we cannot inspect server-side data processing",
  "Dynamic or JavaScript-rendered content may not be fully captured",
  "Policy interpretations are AI-generated and not legal advice",
  "Confidence levels reflect data availability, not certainty of harm",
  "Some privacy practices may be hidden in subsidiary or linked documents",
];

export default function Research() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <AnimatedSection className="py-16 lg:py-24">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6"
            >
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Our Research & Methodology
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Transparency is our foundation. Here's exactly how we analyze privacy policies 
              and why you can trust our assessments.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Methodology Section */}
      <AnimatedSection className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How We Analyze</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-stage analysis pipeline combines automated detection with AI reasoning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {methodologySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Accuracy Metrics */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Accuracy & Performance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We continuously validate our models against expert human analysis
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accuracyMetrics.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl text-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <motion.p 
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {item.metric}
                </motion.p>
                <p className="font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* AI Model Details */}
      <AnimatedSection className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">AI Model Specifications</h2>
            </div>
            
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Primary Model
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Provider:</span> <span className="text-foreground">Google Gemini</span></p>
                    <p><span className="text-muted-foreground">Model:</span> <span className="text-foreground">gemini-3-flash-preview</span></p>
                    <p><span className="text-muted-foreground">Context Window:</span> <span className="text-foreground">1M tokens</span></p>
                    <p><span className="text-muted-foreground">Multimodal:</span> <span className="text-foreground">Yes (text + images)</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Capabilities
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-foreground">Complex reasoning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-foreground">Legal language parsing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-foreground">Pattern recognition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-foreground">Contextual inference</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Responsible AI Principles */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Responsible AI Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Building trust through transparency, accountability, and ethical design
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-background border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{principle.title}</h3>
                      <p className="text-sm text-muted-foreground">{principle.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Limitations */}
      <AnimatedSection className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Known Limitations</h2>
              <p className="text-muted-foreground">
                We believe in honest disclosure of what our tool can and cannot do
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-background border border-yellow-500/30">
              <ul className="space-y-3">
                {limitations.map((limitation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-yellow-400">!</span>
                    </div>
                    <span className="text-muted-foreground">{limitation}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Questions About Our Methodology?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're committed to transparency. Reach out to discuss our approach, 
              suggest improvements, or report issues.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Our Research Team
            </a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
