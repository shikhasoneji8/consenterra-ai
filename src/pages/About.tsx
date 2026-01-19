import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Users, Target, Eye } from "lucide-react";
import SameerPhoto from "@/assets/Sameer_Neve.png";
import ShikhaPhoto from "@/assets/Shikha_Soneji.jpg";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";

// Circle data with full descriptions for tooltips
const circleData = {
  why: {
    title: "Why",
    shortDesc: "Purpose & Belief",
    fullDesc: "Everyone deserves to understand what they invest their time, money, data, and trust in. This is our core belief that drives everything we do."
  },
  how: {
    title: "How",
    shortDesc: "Our Approach",
    fullDesc: "Our solutions translate dense information into insight, context, and confidence. We use AI responsibly to simplify complexity."
  },
  what: {
    title: "What",
    shortDesc: "Our Products",
    fullDesc: "We create AI-powered solutions to solve everyday problems in privacy, entrepreneurship, and sustainable living."
  }
};

const team = [
  {
    name: "Shikha Soneji, Ph.D. (C)",
    role: "CEO & President",
    linkedin: "https://www.linkedin.com/in/shikha-soneji-22620b111/",
    bio: "I'm a Data Scientist and a Ph.D. candidate in Informatics (ABD) with a passion for human-centered AI, digital privacy, and ethical automation.",
    photo: ShikhaPhoto,
  },
  {
    name: "Sameer Neve, Ph.D.",
    role: "Secretary & Chief Sustainability Officer",
    linkedin: "https://www.linkedin.com/in/nevesameer/",
    bio: "Innovative Environmental Engineer & Sustainability Strategist with a Ph.D. and 7+ years of experience bridging engineering, climate resilience, and policy.",
    photo: SameerPhoto,
  },
  {
    name: "Neelam Mulchandani, Ph.D.",
    role: "Financial Advisor",
    linkedin: null,
    bio: "Professor of English at R.K.T. College (University of Mumbai), PG-recognized educator, and published scholar.",
    photo: null,
  },
];

export default function About() {
  const [activeCircle, setActiveCircle] = useState<'why' | 'how' | 'what' | null>(null);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles={false} />
        <div className="section-container text-center relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-gradient mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            About ConsenTerra
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We believe everyone deserves to understand what they invest their time, money, data, and trust in.
          </motion.p>
        </div>
      </section>

      {/* Golden Circle - Concentric Circles Design */}
      <section className="py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="section-container px-4 sm:px-6">
          <AnimatedSection className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Start With <span className="text-gradient">Why</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md mx-auto px-2">
              The Golden Circle: Great leaders think, act, and communicate from the inside out.
            </p>
          </AnimatedSection>
          
          {/* Circles Container - Responsive sizing */}
          <div className="flex justify-center items-center mb-8 sm:mb-12">
            <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              
              {/* Outer Circle - What (clickable) */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-border/60 cursor-pointer transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => setActiveCircle(activeCircle === 'what' ? null : 'what')}
                whileHover={{ borderColor: 'hsl(var(--primary) / 0.5)' }}
                style={{
                  background: 'radial-gradient(circle at center, transparent 60%, hsl(var(--muted) / 0.2) 100%)',
                }}
              />

              {/* Middle Circle - How (clickable) */}
              <motion.div
                className="absolute rounded-full border-2 border-primary/40 cursor-pointer"
                style={{
                  top: '20%',
                  left: '20%',
                  right: '20%',
                  bottom: '20%',
                  background: 'radial-gradient(circle at center, transparent 55%, hsl(var(--primary) / 0.1) 100%)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => setActiveCircle(activeCircle === 'how' ? null : 'how')}
                whileHover={{ borderColor: 'hsl(var(--primary) / 0.7)' }}
                animate={{
                  boxShadow: activeCircle === 'how' 
                    ? '0 0 30px hsl(var(--primary) / 0.3)' 
                    : '0 0 0 0 transparent',
                }}
              />

              {/* Inner Circle - Why (clickable) */}
              <motion.div
                className="absolute rounded-full cursor-pointer"
                style={{
                  top: '35%',
                  left: '35%',
                  right: '35%',
                  bottom: '35%',
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => setActiveCircle(activeCircle === 'why' ? null : 'why')}
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 30px hsl(var(--glow-primary) / 0.4)',
                    '0 0 50px hsl(var(--glow-primary) / 0.6)',
                    '0 0 30px hsl(var(--glow-primary) / 0.4)',
                  ],
                }}
              />

              {/* Labels on circles */}
              {/* What label - top of outer circle */}
              <motion.div
                className="absolute top-4 sm:top-6 lg:top-8 left-1/2 -translate-x-1/2 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm sm:text-base lg:text-lg font-bold text-muted-foreground">What</p>
              </motion.div>

              {/* How label - top of middle circle */}
              <motion.div
                className="absolute top-[22%] sm:top-[21%] left-1/2 -translate-x-1/2 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground/80">How</p>
              </motion.div>

              {/* Why label - center */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-foreground">Why</p>
              </motion.div>

              {/* Animated connecting rings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="27"
                  fill="none"
                  stroke="url(#flowGradient)"
                  strokeWidth="0.3"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#flowGradient)"
                  strokeWidth="0.2"
                  strokeDasharray="3 5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                />
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Decorative dots */}
              {[45, 135, 225, 315].map((angle, i) => (
                <motion.div
                  key={angle}
                  className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{
                    top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.7, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tooltip/Details Panel */}
          <AnimatePresence mode="wait">
            {activeCircle && (
              <motion.div
                key={activeCircle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto mb-8"
              >
                <div 
                  className={`p-4 sm:p-6 rounded-xl border backdrop-blur-sm ${
                    activeCircle === 'why' 
                      ? 'bg-primary/10 border-primary/40' 
                      : activeCircle === 'how'
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      activeCircle === 'why' 
                        ? 'bg-gradient-to-r from-primary to-accent' 
                        : activeCircle === 'how'
                        ? 'bg-primary/50'
                        : 'bg-muted-foreground/50'
                    }`} />
                    <h4 className="font-bold text-foreground text-lg">
                      {circleData[activeCircle].title}: {circleData[activeCircle].shortDesc}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {circleData[activeCircle].fullDesc}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap instruction */}
          <motion.p
            className="text-center text-xs sm:text-sm text-muted-foreground/60 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            Tap each circle to learn more
          </motion.p>

          {/* Flow Direction */}
          <motion.div
            className="flex justify-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <motion.svg 
                width="14" height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-primary"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              <span className="text-xs sm:text-sm font-medium text-primary">
                Inside Out: Why → How → What
              </span>
            </div>
          </motion.div>

          {/* Philosophy Cards */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <motion.div 
                className="text-center p-4 sm:p-5 lg:p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveCircle('why')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-base sm:text-lg font-bold text-primary-foreground">1</span>
                </div>
                <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">Start with Why</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Purpose and belief drive everything.</p>
              </motion.div>

              <motion.div 
                className="text-center p-4 sm:p-5 lg:p-6 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveCircle('how')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                  <span className="text-base sm:text-lg font-bold text-primary">2</span>
                </div>
                <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">Define the How</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Our values guide our methods.</p>
              </motion.div>

              <motion.div 
                className="text-center p-4 sm:p-5 lg:p-6 rounded-xl bg-muted/20 border border-border/50 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveCircle('what')}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-muted/50 border-2 border-border flex items-center justify-center">
                  <span className="text-base sm:text-lg font-bold text-muted-foreground">3</span>
                </div>
                <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">Deliver the What</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Products prove our beliefs.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Target, title: "Our Mission", desc: "To empower individuals and organizations with AI-driven clarity, helping them make informed, ethical, and confident decisions." },
              { icon: Eye, title: "Our Vision", desc: "ConsenTerra aims to become a trusted AI solutions provider by transforming complexity into clarity across privacy, sustainability, and strategic decision-making." },
            ].map((item, i) => (
              <GlowCard key={item.title} delay={i * 0.15} className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Our Team</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, i) => (
              <GlowCard key={member.name} delay={i * 0.15} className="p-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary">{member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}