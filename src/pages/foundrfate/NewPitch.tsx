import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Sparkles, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SAMPLE_PITCH = "I'm building an AI invoicing tool that automatically generates and sends invoices. We have $50k ARR with 200 paying customers. Asking $100k for 10%.";

export default function NewPitch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pitchText, setPitchText] = useState("");
  const [startupName, setStartupName] = useState("");
  const [stage, setStage] = useState<string>("");
  const [arr, setArr] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [equityPercent, setEquityPercent] = useState("");

  const handleSamplePitch = () => {
    setPitchText(SAMPLE_PITCH);
    setStartupName("InvoiceAI");
    setStage("pre_seed");
    setArr("50000");
    setAskAmount("100000");
    setEquityPercent("10");
  };

  const handleSubmit = async () => {
    if (!pitchText.trim()) {
      toast.error("Please enter your pitch");
      return;
    }
    if (!askAmount || parseFloat(askAmount) <= 0) {
      toast.error("Please enter a valid ask amount");
      return;
    }
    if (!equityPercent || parseFloat(equityPercent) <= 0 || parseFloat(equityPercent) > 100) {
      toast.error("Please enter a valid equity percentage (1-100)");
      return;
    }

    setIsLoading(true);

    try {
      // Create the pitch record
      const pitchData = {
        raw_pitch_text: pitchText,
        startup_name: startupName || null,
        stage: (stage as "mvp" | "pre_seed" | "seed" | "growth") || null,
        arr: arr ? parseFloat(arr) : null,
        ask_amount: parseFloat(askAmount),
        equity_percent: parseFloat(equityPercent),
        user_id: user?.id || null,
      };

      const { data: pitch, error: pitchError } = await supabase
        .from('pitches')
        .insert([pitchData])
        .select()
        .single();

      if (pitchError) {
        console.error("Error creating pitch:", pitchError);
        throw new Error("Failed to save pitch");
      }

      // Generate investor panel
      const { data: panelData, error: panelFnError } = await supabase.functions.invoke('generate-investor-panel', {
        body: { pitch: pitchData }
      });

      if (panelFnError) {
        console.error("Error generating panel:", panelFnError);
        throw new Error("Failed to generate investor panel");
      }

      if (panelData.error) {
        throw new Error(panelData.error);
      }

      // Create panel record
      const { data: panel, error: panelError } = await supabase
        .from('panels')
        .insert({
          pitch_id: pitch.id,
          personas: panelData.personas,
          questions: panelData.personas.map((p: any) => ({ 
            investor: p.name, 
            questions: p.questions 
          })),
          offers: panelData.personas.map((p: any) => ({
            investor: p.name,
            amount: p.offer_amount,
            rationale: p.offer_rationale,
          })),
        })
        .select()
        .single();

      if (panelError) {
        console.error("Error creating panel:", panelError);
        throw new Error("Failed to save panel");
      }

      toast.success("Investor panel generated!");
      navigate(`/solutions/foundrfate/panel/${panel.id}`);

    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
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
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Create Your Pitch</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your startup and we'll generate your investor panel
          </p>
        </motion.div>

        {/* Sample Pitch Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-2">Try this sample pitch:</p>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "{SAMPLE_PITCH}"
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSamplePitch}>
                    Use Sample Pitch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pitch Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Pitch</CardTitle>
              <CardDescription>
                Enter your pitch naturally - we'll extract the key details automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Pitch Text */}
              <div className="space-y-2">
                <Label htmlFor="pitch">Pitch Description</Label>
                <Textarea
                  id="pitch"
                  placeholder="I'm building an AI tool that helps founders... We have X customers paying $Y/month. Looking for $Z investment for X% equity."
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Optional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startup-name">Startup Name (optional)</Label>
                  <Input
                    id="startup-name"
                    placeholder="e.g., InvoiceAI"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="pre_seed">Pre-seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arr">ARR ($)</Label>
                  <Input
                    id="arr"
                    type="number"
                    placeholder="e.g., 50000"
                    value={arr}
                    onChange={(e) => setArr(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ask">Ask Amount ($) *</Label>
                  <Input
                    id="ask"
                    type="number"
                    placeholder="e.g., 100000"
                    value={askAmount}
                    onChange={(e) => setAskAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="equity">Equity Offered (%) *</Label>
                  <Input
                    id="equity"
                    type="number"
                    placeholder="e.g., 10"
                    value={equityPercent}
                    onChange={(e) => setEquityPercent(e.target.value)}
                    min="0.1"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Investor Panel...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Investor Panel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
