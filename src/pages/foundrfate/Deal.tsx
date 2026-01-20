import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Trophy, 
  DollarSign, 
  PieChart, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Calculator,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Allocation {
  name: string;
  role: string;
  amount: number;
  equity_percent: number;
  rationale: string;
}

interface DealTerms {
  headline: string;
  tagline: string;
  deal_highlights: string[];
  risk_summary: string;
  success_prediction: string;
  deal_grade: string;
  ask_amount: number;
  equity_percent: number;
  total_raised: number;
  post_money_valuation: number;
  funding_percentage: number;
  allocations: Allocation[];
  is_fully_funded: boolean;
}

interface DealData {
  id: string;
  panel_id: string;
  status: string;
  deal_terms: DealTerms;
}

export default function Deal() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
      } catch (error) {
        console.error("Error fetching deal:", error);
        toast.error("Failed to load deal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  const handleAcceptDeal = async () => {
    if (!deal) return;

    setIsProcessing(true);

    try {
      // Update deal status to accepted
      const { error } = await supabase
        .from('deals')
        .update({ status: 'accepted' })
        .eq('id', deal.id);

      if (error) throw error;

      toast.success("Deal accepted!");
      navigate(`/solutions/foundrfate/success/${deal.id}`);

    } catch (error) {
      console.error("Error accepting deal:", error);
      toast.error("Failed to accept deal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineDeal = async () => {
    if (!deal) return;

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: 'declined' })
        .eq('id', deal.id);

      if (error) throw error;

      toast.info("Deal declined");
      navigate('/solutions/foundrfate');

    } catch (error) {
      console.error("Error declining deal:", error);
      toast.error("Failed to decline deal");
    } finally {
      setIsProcessing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "text-green-500";
    if (grade.startsWith('B')) return "text-blue-500";
    if (grade.startsWith('C')) return "text-amber-500";
    return "text-red-500";
  };

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
      <div className="max-w-4xl mx-auto">
        {/* Demo Mode Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="outline" className="text-amber-500 border-amber-500/50 bg-amber-500/10">
            <Sparkles className="w-3 h-3 mr-1" />
            Demo Mode - Test Payments
          </Badge>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{terms.headline}</h1>
          <p className="text-xl text-muted-foreground">{terms.tagline}</p>
          <div className="mt-4">
            <Badge className={`text-2xl px-4 py-2 ${getGradeColor(terms.deal_grade)}`}>
              <Star className="w-5 h-5 mr-1" />
              Grade: {terms.deal_grade}
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">${terms.total_raised.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Raised</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <PieChart className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{terms.equity_percent}%</div>
              <div className="text-xs text-muted-foreground">Equity Given</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">${(terms.post_money_valuation / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-muted-foreground">Post-Money Val</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{terms.allocations.length}</div>
              <div className="text-xs text-muted-foreground">Investors</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Funding Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Funding Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Raised: ${terms.total_raised.toLocaleString()}</span>
                  <span>Ask: ${terms.ask_amount.toLocaleString()}</span>
                </div>
                <Progress value={Math.min(terms.funding_percentage, 100)} className="h-3" />
                <div className="text-center text-sm text-muted-foreground">
                  {terms.funding_percentage.toFixed(0)}% of target
                  {terms.is_fully_funded && (
                    <Badge className="ml-2 bg-green-500">Fully Funded!</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Allocations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Investor Allocations</CardTitle>
              <CardDescription>
                Equity split proportional to investment amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {terms.allocations.map((allocation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{allocation.name}</div>
                      <div className="text-sm text-muted-foreground">{allocation.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">${allocation.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{allocation.equity_percent.toFixed(2)}% equity</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                <Calculator className="w-4 h-4 inline mr-1" />
                Formula: investor_equity = total_equity × (investor_amount / ask_amount)
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deal Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Deal Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {terms.deal_highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="space-y-2">
                <p className="text-sm"><strong>Risk Summary:</strong> {terms.risk_summary}</p>
                <p className="text-sm"><strong>Prediction:</strong> {terms.success_prediction}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-muted-foreground italic">
            "One click can move ${terms.total_raised.toLocaleString()}+ (test mode). 
            This replaces weeks of fundraising meetings with one execution flow."
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleAcceptDeal}
            disabled={isProcessing}
            size="lg"
            className="px-12 bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            )}
            Accept Investment
          </Button>
          <Button
            onClick={handleDeclineDeal}
            disabled={isProcessing}
            variant="outline"
            size="lg"
            className="px-12"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Decline
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
