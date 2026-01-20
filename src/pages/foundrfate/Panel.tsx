import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Loader2,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Persona {
  name: string;
  role: string;
  thesis: string;
  risk_appetite: string;
  questions: string[];
  risk_note: string;
  offer_amount: number;
  offer_rationale: string;
}

interface PanelData {
  id: string;
  pitch_id: string;
  personas: Persona[];
  pitches: {
    startup_name: string | null;
    ask_amount: number;
    equity_percent: number;
    raw_pitch_text: string;
  };
}

export default function Panel() {
  const { panelId } = useParams();
  const navigate = useNavigate();
  const [panel, setPanel] = useState<PanelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingDeal, setIsGeneratingDeal] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchPanel = async () => {
      if (!panelId) return;

      try {
        const { data, error } = await supabase
          .from('panels')
          .select(`
            id,
            pitch_id,
            personas,
            pitches (
              startup_name,
              ask_amount,
              equity_percent,
              raw_pitch_text
            )
          `)
          .eq('id', panelId)
          .single();

        if (error) throw error;
        
        // Type assertion for the joined data
        const panelData = data as unknown as PanelData;
        setPanel(panelData);
        
        // Initialize answers
        const initialAnswers: Record<string, string[]> = {};
        (panelData.personas as Persona[]).forEach(persona => {
          initialAnswers[persona.name] = persona.questions.map(() => "");
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Error fetching panel:", error);
        toast.error("Failed to load panel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanel();
  }, [panelId]);

  const handleAnswerChange = (investorName: string, questionIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [investorName]: prev[investorName].map((a, i) => i === questionIndex ? value : a)
    }));
  };

  const handleGenerateDeal = async () => {
    if (!panel) return;

    setIsGeneratingDeal(true);

    try {
      const { data: dealData, error: dealFnError } = await supabase.functions.invoke('generate-deal-ui', {
        body: {
          pitch: panel.pitches,
          personas: panel.personas,
          answers
        }
      });

      if (dealFnError) {
        console.error("Error generating deal:", dealFnError);
        throw new Error("Failed to generate deal");
      }

      if (dealData.error) {
        throw new Error(dealData.error);
      }

      // Create deal record
      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
          panel_id: panel.id,
          status: 'draft',
          deal_terms: dealData.deal_terms,
        })
        .select()
        .single();

      if (dealError) {
        console.error("Error creating deal:", dealError);
        throw new Error("Failed to save deal");
      }

      toast.success("Deal generated!");
      navigate(`/solutions/foundrfate/deal/${deal.id}`);

    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsGeneratingDeal(false);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-amber-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'high':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!panel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Panel not found</p>
      </div>
    );
  }

  const personas = panel.personas as Persona[];
  const totalOffers = personas.reduce((sum, p) => sum + p.offer_amount, 0);
  const participatingCount = personas.filter(p => p.offer_amount > 0).length;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Your Investor Panel</h1>
          <p className="text-muted-foreground text-lg">
            {panel.pitches.startup_name || 'Your Startup'} - ${panel.pitches.ask_amount.toLocaleString()} for {panel.pitches.equity_percent}%
          </p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{personas.length}</div>
              <div className="text-sm text-muted-foreground">Investors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">{participatingCount}</div>
              <div className="text-sm text-muted-foreground">Participating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">${totalOffers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Offered</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Cards */}
        <div className="space-y-6 mb-8">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className={persona.offer_amount > 0 ? "border-primary/30" : "opacity-75"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {persona.name}
                        <Badge variant="secondary">{persona.role}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">{persona.thesis}</CardDescription>
                    </div>
                    <Badge className={getRiskColor(persona.risk_appetite)}>
                      {getRiskIcon(persona.risk_appetite)}
                      <span className="ml-1">{persona.risk_appetite} Risk</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Questions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4" />
                      Questions
                    </div>
                    {persona.questions.map((question, qIndex) => (
                      <div key={qIndex} className="pl-6 space-y-2">
                        <p className="text-sm text-muted-foreground">"{question}"</p>
                        <Input
                          placeholder="Your answer (optional)..."
                          value={answers[persona.name]?.[qIndex] || ""}
                          onChange={(e) => handleAnswerChange(persona.name, qIndex, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Risk Note */}
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{persona.risk_note}</p>
                  </div>

                  <Separator />

                  {/* Offer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Offer:</span>
                      <span className={persona.offer_amount > 0 ? "text-green-500 font-bold" : "text-muted-foreground"}>
                        {persona.offer_amount > 0 ? `$${persona.offer_amount.toLocaleString()}` : "No offer"}
                      </span>
                    </div>
                    {persona.offer_amount > 0 && (
                      <p className="text-sm text-muted-foreground italic">"{persona.offer_rationale}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generate Deal Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleGenerateDeal}
            disabled={isGeneratingDeal || participatingCount === 0}
            size="lg"
            className="px-8"
          >
            {isGeneratingDeal ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Deal UI...
              </>
            ) : (
              <>
                Generate Deal UI
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          {participatingCount === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              No investors made offers. Try a different pitch!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
