import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Rocket, Leaf, CheckCircle, Sparkles, ArrowRight, Chrome, HelpCircle } from "lucide-react";
import logo from "@/assets/ConsenTerra_Logo.png";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import RotatingHeadlinePhrase from "@/components/RotatingHeadlinePhrase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is ConsenTerra?",
    answer: "ConsenTerra is a company that builds AI-powered tools to help people understand complex information and make better decisions in areas like digital privacy, entrepreneurship, and sustainable living."
  },
  {
    question: "How does PriXplainer work?",
    answer: "PriXplainer analyzes websites and privacy policies using AI to identify data collection practices, tracking methods, and potential privacy risks. It then provides a trust score and plain-language explanations so you understand what you're agreeing to."
  },
  {
    question: "Is PriXplainer free to use?",
    answer: "Yes! Our web-based privacy scanner is free to use. Simply enter any website URL and get an instant privacy analysis. We also have a Chrome extension in development for even easier scanning."
  },
  {
    question: "What data do you collect when I use your tools?",
    answer: "We practice what we preach. For privacy scans, we only send the website domain name for analysis—we never collect your browsing history, personal information, or form inputs. Your privacy is our priority."
  },
  {
    question: "What are FoundrFATE and TrustEarthy?",
    answer: "FoundrFATE helps early-stage founders understand fundraising and investor dynamics with plain-language guidance. TrustEarthy helps users make sustainable consumption choices through trusted product comparisons and habit-friendly recommendations. Both are currently in development."
  },
  {
    question: "How can I get in touch or provide feedback?",
    answer: "We'd love to hear from you! Visit our Contact page to reach out with questions, feedback, or partnership inquiries. You can also join the waitlist for our Chrome extension to get updates."
  }
];
const solutions = [
  {
    id: "prixplainer",
    name: "PriXplainer",
    tagline: "Understand before you consent.",
    description: "PriXplainer decodes privacy policies and terms of service using AI-driven analysis, risk indicators, and human-readable summaries—making invisible data practices visible.",
    capabilities: [
      "AI-generated policy summaries",
      "Risk and severity indicators",
      "Ontology-based clause classification",
      "User-centric explanations (no legal jargon)"
    ],
    icon: Shield,
    href: "/solutions/prixplainer",
    color: "text-primary"
  },
  {
    id: "foundrfate",
    name: "FoundrFATE",
    tagline: "Founder success shouldn't feel like luck.",
    description: "FoundrFATE helps early-stage founders understand the forces shaping their journey—before those forces decide for them.",
    capabilities: [
      "Funding readiness assessment",
      "Investor education & outreach guidance",
      "Plain-language fundraising explanations",
      "Founder-first, bias-aware design"
    ],
    icon: Rocket,
    href: "/solutions/foundrfate",
    color: "text-ocean"
  },
  {
    id: "trustearthy",
    name: "TrustEarthy",
    tagline: "Small swaps. Real impact.",
    description: "TrustEarthy helps users make sustainable consumption choices through trusted comparisons, impact snapshots, and habit-friendly recommendations.",
    capabilities: [
      "Sustainable product comparisons",
      "Impact snapshots",
      "Practical, low-overwhelm education",
      "Habit-based nudges"
    ],
    icon: Leaf,
    href: "/solutions/trusteartthy",
    color: "text-eco-green"
  }
];

export default function Home() {
  const [showSolutions, setShowSolutions] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen lg:min-h-[90vh] relative overflow-hidden">
        <AuroraBackground showParticles={true} />
        
        <div className="section-container h-full py-6 sm:py-8 lg:py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[85vh] lg:min-h-[80vh]">
            {/* Left Side - Large Logo with parallax effect */}
            <motion.div
              className="flex justify-center lg:justify-center items-center order-1 lg:order-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <motion.img
                src={logo}
                alt="ConsenTerra"
                className="w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px] object-contain"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: "drop-shadow(0 0 60px hsl(270 80% 60% / 0.2))",
                }}
              />
            </motion.div>

            {/* Right Side - Content */}
            <div className="text-center lg:text-left flex flex-col order-2 lg:order-2 px-2 sm:px-0">
              {/* Eyebrow Text */}
              <motion.p
                className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-primary/80 mb-4 sm:mb-6 uppercase flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                CLARITY FOR EVERYDAY DECISIONS
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </motion.p>

              {/* Main Headline */}
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.15] mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                ConsenTerra builds simple{" "}
                <span className="text-gradient">AI tools</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>for clarity in <RotatingHeadlinePhrase />
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-2 sm:mb-3 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                Privacy, early-stage entrepreneurship, and sustainable living,
                <br className="hidden md:block" />
                explained without the noise.
              </motion.p>

              {/* Micro-copy */}
              <motion.p
                className="text-xs sm:text-sm text-muted-foreground/60 mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                Less guesswork. More clear choices.
              </motion.p>

              {/* Solutions Button */}
              <motion.div
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
              >
                <Button
                  size="lg"
                  variant="glow"
                  className="rounded-full px-6 sm:px-8 text-sm sm:text-base spark-hover"
                  onClick={() => setShowSolutions(!showSolutions)}
                >
                  Explore our tools
                  <motion.span
                    animate={{ rotate: showSolutions ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.span>
                </Button>
              </motion.div>

              {/* Solutions Dropdown */}
              {showSolutions && (
                <motion.div
                  className="mt-4 sm:mt-6 w-full max-w-4xl mx-auto lg:mx-0 glass-strong rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 relative z-50"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  style={{
                    boxShadow: "0 0 50px hsl(270 80% 60% / 0.15), 0 25px 50px -12px hsl(0 0% 0% / 0.5)",
                  }}
                >
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {solutions.map((solution, index) => {
                      const Icon = solution.icon;
                      return (
                        <motion.div
                          key={solution.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.12 }}
                        >
                          <Link
                            to={solution.href}
                            className="group block p-4 sm:p-5 bg-surface-1 rounded-lg sm:rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 text-left h-full"
                            style={{
                              background: "linear-gradient(145deg, hsl(240 10% 10%) 0%, hsl(240 10% 7%) 100%)",
                            }}
                          >
                            <motion.div
                              className={`inline-flex p-2 rounded-lg bg-primary/10 mb-2 sm:mb-3 ${solution.color}`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.div>
                            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                              {solution.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-primary/80 italic mb-2 sm:mb-3">
                              {solution.tagline}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                              {solution.description}
                            </p>
                            <ul className="space-y-1 sm:space-y-1.5 hidden sm:block">
                              {solution.capabilities.map((cap) => (
                                <li
                                  key={cap}
                                  className="flex items-start gap-2 text-xs text-muted-foreground"
                                >
                                  <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0 mt-0.5" />
                                  {cap}
                                </li>
                              ))}
                            </ul>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Click outside to close */}
      {showSolutions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSolutions(false)}
        />
      )}

      {/* Welcome Section */}
      <section className="py-12 sm:py-16 lg:py-28 relative">
        <div className="section-container px-4 sm:px-6">
          <AnimatedSection className="max-w-3xl mx-auto" delay={0.1}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-10">
              Welcome to{" "}
              <span className="text-gradient">ConsenTerra</span>
            </h2>

            <div className="prose-editorial text-sm sm:text-base md:text-lg space-y-4 sm:space-y-6">
              <AnimatedSection delay={0.2}>
                <p>
                  ConsenTerra builds thoughtful AI tools that help people understand complex
                  information and make better choices in their daily lives. We focus on areas
                  where decisions often feel confusing, rushed, or unclear, such as digital
                  privacy, early-stage entrepreneurship, and sustainable living.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <p>
                  Our goal is not to overwhelm users with technical detail or marketing language.
                  Instead, we aim to explain things clearly, highlight what matters most, and
                  support informed decision-making. Each product we build is designed to be
                  practical, transparent, and easy to use, so people can move forward with
                  confidence rather than uncertainty.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <p className="mb-0">
                  At ConsenTerra, we believe clarity builds trust. By turning complexity into
                  understanding, we help individuals and organizations make choices that align
                  with their values, responsibilities, and long-term goals.
                </p>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>


      {/* PriXplainer CTA */}
      <section className="py-10 sm:py-16 relative overflow-hidden">
        <div className="section-container px-4 sm:px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <GlowCard className="p-5 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      style={{ boxShadow: "0 0 40px hsl(270 80% 60% / 0.3)" }}
                    >
                      <Shield className="h-8 w-8 text-primary" />
                    </motion.div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Scan any website for privacy risks
                    </h3>
                    <p className="text-muted-foreground mb-0">
                      PriXplainer uses AI to decode privacy policies and reveal hidden data practices. 
                      Try it free on the web or get notified when our Chrome extension launches.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
                    <Button asChild variant="glow" size="lg" className="gap-2 w-full sm:w-auto">
                      <Link to="/solutions/prixplainer">
                        Try Free Scan
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                      <Link to="/extension">
                        <Chrome className="h-4 w-4" />
                        Extension
                      </Link>
                    </Button>
                  </div>
                </div>
              </GlowCard>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features/Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="section-container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Built on <span className="text-gradient">Core Values</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Every tool we create is designed with clarity, trust, and user-first principles at its heart.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Clarity",
                description: "We transform complex information into understandable insights that empower better decisions.",
                icon: "✨",
              },
              {
                title: "Trust",
                description: "Every product is built with transparency and ethical AI principles at its foundation.",
                icon: "🛡️",
              },
              {
                title: "Impact",
                description: "We focus on real-world outcomes that make a meaningful difference in people's lives.",
                icon: "🎯",
              },
            ].map((value, index) => (
              <GlowCard key={value.title} delay={index * 0.15} className="p-5 sm:p-6 lg:p-8">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{value.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-surface-1/30">
        <div className="section-container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4 sm:mb-6">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
              Everything you need to know about ConsenTerra and our AI-powered tools.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem 
                    value={`faq-${index}`} 
                    className="border border-border/50 rounded-lg sm:rounded-xl px-4 sm:px-6 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-sm sm:text-base md:text-lg font-medium text-foreground hover:text-primary py-4 sm:py-5 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm md:text-base text-muted-foreground pb-4 sm:pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <AnimatedSection delay={0.5} className="text-center mt-8 sm:mt-12">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Still have questions? We'd love to help.
              </p>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}