import { Linkedin, Users, Target, Eye } from "lucide-react";
import SameerPhoto from "@/assets/Sameer_Neve.png";
import ShikhaPhoto from "@/assets/Shikha_Soneji.jpg";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
// import GlowCard from "@/components/GlowCard";

const team = [
  {
    name: "Shikha Soneji, Ph.D. (C)",
    role: "CEO & President",
    linkedin: "https://www.linkedin.com/in/shikha-soneji-22620b111/",
    bio: "I'm a Data Scientist and a Ph.D. candidate in Informatics (ABD) with a passion for human-centered AI, digital privacy, and ethical automation. My work bridges enterprise AI systems with research-grade rigor to make AI not just smarter—but more trustworthy, interpretable, and impactful.",
    photo: ShikhaPhoto,
  },
  {
    name: "Sameer Neve, Ph.D.",
    role: "Secretary & Chief Sustainability Officer",
    linkedin: "https://www.linkedin.com/in/nevesameer/",
    bio: "Innovative Environmental Engineer & Sustainability Strategist with a Ph.D. and 7+ years of experience bridging engineering, climate resilience, and policy. Expert in decarbonization, remediation, renewable energy, and ESG analytics. Known for translating complex R&D into scalable, cost-effective solutions.",
    photo: SameerPhoto,
  },
  {
    name: "Neelam Mulchandani, Ph.D.",
    role: "Financial Advisor",
    linkedin: null,
    bio: "Professor of English at R.K.T. College (University of Mumbai), PG-recognized educator, and published scholar. Her work spans feminism, cultural displacement, and Indian literary studies, bringing humanistic insight to financial and ethical decision-making.",
    photo: null,
  },
];

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
      <AuroraBackground showParticles={false} />
        <div className="section-container text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            About ConsenTerra
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe everyone deserves to understand what they invest their time, money, data, and trust in.
          </p>
        </div>
      </section>

      {/* Start With Why - Golden Circle */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Start With Why
            </h2>
            
            {/* Golden Circle Visual */}
            <div className="flex flex-col items-center mb-16">
              <div className="relative">
                {/* Outer Circle - What */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-primary/10 flex items-center justify-center">
                  {/* Middle Circle - How */}
                  <div className="w-52 h-52 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-primary/20 flex items-center justify-center">
                    {/* Inner Circle - Why */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center shadow-lg">
                      <span className="text-2xl lg:text-3xl font-bold text-primary-foreground">Why</span>
                    </div>
                  </div>
                </div>
                
                {/* Labels */}
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground/70">What</span>
                <span className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 text-sm font-semibold text-foreground/70">How</span>
              </div>
            </div>

            {/* Why, How, What Explanations */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Why */}
              <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-3">Why</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In today's world, understanding is power. We believe everyone deserves to understand what they invest their time, money, data, and trust in.
                </p>
              </div>
              
              {/* How */}
              <div className="p-6 bg-card rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3">How</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our solutions translate dense information into insight, context, and confidence.
                </p>
              </div>
              
              {/* What */}
              <div className="p-6 bg-card rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3">What</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We create AI-powered solutions to solve everyday problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="p-8 bg-background rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower individuals and organizations with AI-driven clarity, helping them make 
                informed, ethical, and confident decisions in an increasingly complex world.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 bg-background rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ConsenTerra aims to become a trusted AI solutions provider for everyone—from everyday 
                consumers to global enterprises—by transforming complexity into clarity across privacy, 
                sustainability, and strategic decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Our Team</h2>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Meet the experts driving ConsenTerra's mission forward
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Photo or Avatar Placeholder */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-forest-light/20 flex items-center justify-center">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
