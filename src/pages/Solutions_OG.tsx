import { Link } from "react-router-dom";
import { Shield, Rocket, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    icon: Shield,
    name: "PriXplainer",
    tagline: "Understand before you consent.",
    description: "PriXplainer decodes privacy policies and terms of service using AI-driven analysis, risk indicators, and human-readable summaries—making invisible data practices visible.",
    capabilities: [
      "AI-generated policy summaries",
      "Risk and severity indicators",
      "Ontology-based clause classification",
      "User-centric explanations (no legal jargon)",
    ],
    href: "/solutions/prixplainer",
    color: "from-primary to-forest-light",
  },
  {
    icon: Rocket,
    name: "FoundrFATE",
    tagline: "Founder success shouldn't feel like luck.",
    description: "FoundrFATE helps early-stage founders understand the forces shaping their journey—before those forces decide for them.",
    capabilities: [
      "Funding readiness assessment",
      "Investor education & outreach guidance",
      "Plain-language fundraising explanations",
      "Founder-first, bias-aware design",
    ],
    href: "/solutions/foundrfate",
    color: "from-ocean to-primary",
  },
  {
    icon: Leaf,
    name: "TrustEarthy",
    tagline: "Small swaps. Real impact.",
    description: "TrustEarthy helps users make sustainable consumption choices through trusted comparisons, impact snapshots, and habit-friendly recommendations.",
    capabilities: [
      "Sustainable product comparisons",
      "Impact snapshots",
      "Practical, low-overwhelm education",
      "Habit-based nudges",
    ],
    href: "/solutions/trusteartthy",
    color: "from-earth to-sage",
  },
];

export default function Solutions() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="section-container text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered tools that translate complexity into clarity across privacy, 
            sustainability, and strategic decision-making.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="space-y-16 max-w-5xl mx-auto">
            {solutions.map((solution, index) => (
              <div
                key={solution.name}
                className={`flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-8 lg:gap-12 items-center`}
              >
                {/* Icon Card */}
                <div className="flex-shrink-0">
                  <div className={`w-40 h-40 lg:w-52 lg:h-52 rounded-3xl bg-gradient-to-br ${solution.color} flex items-center justify-center shadow-xl`}>
                    <solution.icon className="h-16 w-16 lg:h-20 lg:w-20 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {solution.name}
                  </h2>
                  <p className="text-lg text-primary font-medium mb-4">
                    {solution.tagline}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {solution.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                      Key Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {solution.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild>
                    <Link to={solution.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Interested in our solutions?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Get in touch to learn how ConsenTerra can help you make better decisions.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
