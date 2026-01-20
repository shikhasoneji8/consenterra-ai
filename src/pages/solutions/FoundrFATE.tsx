import { Link } from "react-router-dom";
import { Rocket, CheckCircle, Target, ArrowRight, Users, DollarSign, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Users,
    title: "AI-Generated Investor Panel",
    description: "Get 3-5 unique investor personas with realistic questions and offers.",
  },
  {
    icon: Zap,
    title: "One-Click Deal Execution",
    description: "Accept investments instantly with dynamically generated deal terms.",
  },
  {
    icon: DollarSign,
    title: "Move $100K+ (Demo Mode)",
    description: "Experience real transaction flows in a safe test environment.",
  },
  {
    icon: Target,
    title: "Smart Valuation Calculator",
    description: "Automatic equity splits and post-money valuation calculations.",
  },
];

const steps = [
  {
    step: "1",
    title: "Pitch Your Startup",
    description: "Enter your pitch, traction metrics, and funding ask in plain language.",
  },
  {
    step: "2",
    title: "Meet Your Investors",
    description: "AI generates 3-5 investor personas who ask sharp questions and make offers.",
  },
  {
    step: "3",
    title: "Review the Deal",
    description: "See a dynamically generated deal UI with allocations and valuation.",
  },
  {
    step: "4",
    title: "Accept & Execute",
    description: "One click moves money (test mode) - replacing weeks of meetings.",
  },
];

export default function FoundrFATE() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-ocean to-primary text-primary-foreground">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            {/* Demo Badge */}
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Investor Panel Demo
            </Badge>
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/20 mb-6">
              <Rocket className="h-10 w-10" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">FoundrFATE</h1>
            <p className="text-2xl text-primary-foreground/90 font-medium mb-4">
              One pitch, one click, money moves.
            </p>
            <p className="text-lg text-primary-foreground/70 leading-relaxed mb-8">
              A Shark Tank-style investor panel where AI generates personas, asks questions,
              makes offers, and executes deals—all in one flow.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/solutions/foundrfate/new">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start a Panel
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/solutions/foundrfate/history">
                  View Past Pitches
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-muted-foreground italic">
              "This replaces weeks of fundraising meetings with one execution flow."
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From pitch to funded in minutes, not months
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-6"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 relative z-10">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-xl">
              <Target className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">The Challenge We Solve</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most founders spend weeks in fundraising meetings, only to face rejection 
                  or unclear feedback. FoundrFATE simulates the entire investor interaction—from 
                  questions to term sheets—so you can practice, learn, and execute faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to pitch?
            </h2>
            <p className="text-muted-foreground mb-8">
              Try the demo now—no signup required. See how AI-generated investors 
              respond to your pitch in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/solutions/foundrfate/new">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start a Panel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/solutions">View All Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
