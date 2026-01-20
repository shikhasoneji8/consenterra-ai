import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  DollarSign, 
  PartyPopper,
  Rocket,
  Loader2,
  ArrowRight,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import confetti from 'canvas-confetti';

interface Allocation {
  name: string;
  role: string;
  amount: number;
  equity_percent: number;
}

interface DealTerms {
  headline: string;
  total_raised: number;
  equity_percent: number;
  post_money_valuation: number;
  allocations: Allocation[];
  deal_grade: string;
}

interface DealData {
  id: string;
  status: string;
  deal_terms: DealTerms;
  created_at: string;
}

export default function Success() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!dealId) return;

      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('id', dealId)
          .single();

        if (error) throw error;
        setDeal(data as unknown as DealData);

        // Trigger confetti on load
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 300);

      } catch (error) {
        console.error("Error fetching deal:", error);
        toast.error("Failed to load deal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Deal not found</p>
      </div>
    );
  }

  const terms = deal.deal_terms;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
            <PartyPopper className="w-3 h-3 mr-1" />
            Deal Accepted
          </Badge>
          <h1 className="text-4xl font-bold mb-2">Congratulations! 🎉</h1>
          <p className="text-xl text-muted-foreground">Your funding round is complete</p>
        </motion.div>

        {/* Deal Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-500" />
                Deal Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Raised */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Total Raised</span>
                </div>
                <span className="text-2xl font-bold text-green-500">
                  ${terms.total_raised.toLocaleString()}
                </span>
              </div>

              <Separator />

              {/* Investors */}
              <div>
                <h4 className="font-medium mb-3">Participating Investors</h4>
                <div className="space-y-2">
                  {terms.allocations.map((allocation, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>
                        {allocation.name} <span className="text-muted-foreground">({allocation.role})</span>
                      </span>
                      <span className="font-medium">
                        ${allocation.amount.toLocaleString()} ({allocation.equity_percent.toFixed(2)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{terms.equity_percent}%</div>
                  <div className="text-xs text-muted-foreground">Equity Given</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ${(terms.post_money_valuation / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-muted-foreground">Post-Money Valuation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Mode:</strong> In production, this would trigger actual payment processing 
                and legal document generation. The funds would be transferred upon completion of 
                KYC/AML requirements and signature of investment agreements.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/solutions/foundrfate/new')}
            size="lg"
            className="px-8"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Run Another Pitch
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <Link to="/solutions/foundrfate/history">
              View History
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
