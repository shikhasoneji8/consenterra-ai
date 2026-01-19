import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, PlanType } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    id: "basic" as PlanType,
    name: "Basic",
    price: 2.99,
    description: "Perfect for casual users who want more scans",
    icon: Zap,
    features: [
      "50 website scans per month",
      "Basic risk analysis",
      "Scan history",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro" as PlanType,
    name: "Pro",
    price: 6.99,
    description: "For power users who need unlimited access",
    icon: Crown,
    features: [
      "Unlimited website scans",
      "Advanced risk analysis",
      "Detailed privacy reports",
      "Priority support",
      "API access (coming soon)",
    ],
    popular: true,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, upgradePlan, loading } = useSubscription();
  const { toast } = useToast();
  const [upgrading, setUpgrading] = useState<PlanType | null>(null);

  const handleSelectPlan = async (planId: PlanType) => {
    if (!user) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }

    setUpgrading(planId);
    try {
      await upgradePlan(planId);
      toast({
        title: "Plan upgraded!",
        description: `You're now on the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      });
      navigate("/solutions/prixplainer");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlan = subscription?.plan || "free";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your privacy analysis needs
          </p>
        </AnimatedSection>

        {/* Current plan indicator */}
        {user && (
          <AnimatedSection delay={0.1} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <span className="text-muted-foreground">Current plan:</span>
              <span className="font-medium capitalize">{currentPlan}</span>
            </div>
          </AnimatedSection>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <AnimatedSection key={plan.id} delay={0.2 + index * 0.1}>
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      plan.popular
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center pb-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={currentPlan === plan.id || upgrading !== null || loading}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {upgrading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : currentPlan === plan.id ? (
                      "Current Plan"
                    ) : (
                      `Get ${plan.name}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Free tier info */}
        <AnimatedSection delay={0.4} className="text-center mt-12">
          <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Free Plan</h3>
            <p className="text-muted-foreground text-sm">
              Get started with 2 free website scans per account. No credit card required.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Pricing;
