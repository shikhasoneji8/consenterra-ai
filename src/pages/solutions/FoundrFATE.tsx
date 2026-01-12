import { Link } from "react-router-dom";
import { Rocket, CheckCircle, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoCarousel from "@/components/DemoCarousel";

const demoSlides = [
  {
    title: "Share Your Startup Story",
    description: "Tell us about your startup, your market, your team, and where you are in your journey. FoundrFATE adapts to your unique situation.",
    highlight: "Designed for founders at any stage—from idea validation to Series A."
  },
  {
    title: "Funding Readiness Assessment",
    description: "Get an honest evaluation of your funding readiness across key dimensions: market opportunity, team strength, traction, and financials.",
    highlight: "Benchmarked against thousands of successful (and unsuccessful) funding rounds."
  },
  {
    title: "Investor Match & Education",
    description: "Learn which types of investors are the best fit for your stage and sector. Understand what VCs, angels, and accelerators are really looking for.",
    highlight: "Plain-language explanations of term sheets, valuations, and deal structures."
  },
  {
    title: "Your Personalized Roadmap",
    description: "Receive a clear action plan with specific steps to improve your chances of successful fundraising. No more guessing what to do next.",
    highlight: "Built with bias awareness to support underrepresented founders."
  }
];

const features = [
  {
    title: "Funding Readiness Assessment",
    description: "Understand where you stand and what investors are looking for.",
  },
  {
    title: "Investor Education",
    description: "Learn the language and expectations of the investment world.",
  },
  {
    title: "Plain-Language Explanations",
    description: "Fundraising concepts explained without industry jargon.",
  },
  {
    title: "Founder-First Design",
    description: "Built with bias awareness to support underrepresented founders.",
  },
];

export default function FoundrFATE() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-ocean to-primary text-primary-foreground">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
              <Rocket className="h-8 w-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">FoundrFATE</h1>
            <p className="text-xl text-primary-foreground/90 font-medium mb-4">
              Founder success shouldn't feel like luck.
            </p>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              FoundrFATE helps early-stage founders understand the forces shaping their 
              journey—before those forces decide for them.
            </p>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-ocean/5 border border-ocean/20 rounded-xl">
              <Target className="h-6 w-6 text-ocean flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">The Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most founders fail due to decision blind spots, not lack of ideas. Only 1 in 10 
                  startups succeed, and early-stage founders spend 40% of their time on non-core 
                  tasks. Clarity can change those odds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Key Capabilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 bg-background rounded-xl border border-border"
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Carousel */}
      <DemoCarousel 
        slides={demoSlides}
        title="See FoundrFATE in Action"
        subtitle="Discover how FoundrFATE helps early-stage founders navigate fundraising with clarity and confidence."
      />

      {/* CTA */}
      <section className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to take control of your founder journey?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact us to learn more about FoundrFATE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/solutions">View All Solutions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
