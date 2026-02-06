import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Zap, Brain, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import { Client } from "@gradio/client"; // Import Gradio Client

const features = [
  { 
    icon: Brain,
    title: "PrivBERT AI Model", 
    description: "Powered by a specialized transformer model trained on privacy policies.",
    color: "from-violet-500 to-purple-600"
  },
  { 
    icon: Eye,
    title: "Risk Detection", 
    description: "Visual severity indicators highlight concerning practices instantly.",
    color: "from-rose-500 to-red-600"
  },
  { 
    icon: Zap,
    title: "Instant Analysis", 
    description: "Get results in seconds, not the 18 minutes it takes to read manually.",
    color: "from-amber-500 to-orange-600"
  },
  { 
    icon: Sparkles,
    title: "Plain Language", 
    description: "No legal jargon—just clear explanations anyone can understand.",
    color: "from-emerald-500 to-green-600"
  },
];

export default function PriXplainer() {
  const [policyText, setPolicyText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the connection to app.py on Hugging Face
  const handleScan = async () => {
    if (!policyText.trim()) return;
    
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // 1. Connect to your Space (REPLACE with your actual username/space name)
      const app = await Client.connect("shikhasoneji8/privacywhisper");

      // 2. Call the prediction endpoint. 
      // In your app.py, btn_annotate calls _run_annotation with [text, threshold]
      const result = await app.predict("/predict", { 
        text_input: policyText, 
        threshold: 0.5 
      });

      // 3. Handle the returned data. Based on app.py:
      // output[0] = raw_df, output[1] = Topic_filter, etc.
      // Note: Because app.py uses .then(), the actual HTML rendering 
      // happens in the second step. If /predict only returns the first step,
      // you may need to call the specific function index from the Space API.
      console.log("Data received:", result.data);
      
      // Temporary: Setting a success message to prove connection
      setAnalysisResult("Analysis complete! Check console for raw data mapping.");
      
    } catch (error) {
      console.error("Analysis Error:", error);
      setAnalysisResult("Error connecting to PrivBERT. Please check your Space status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles={true} />
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-gradient">PriXplainer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Stop blindly clicking "I Agree". Our AI reads privacy policies so you don't have to.
            </p>

            {/* NEW: Input Area in PriXplainer Page */}
            <div className="max-w-xl mx-auto space-y-4">
              <textarea 
                className="w-full p-4 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary outline-none transition-all h-40"
                placeholder="Paste privacy policy text here..."
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
              />
              <Button 
                onClick={handleScan} 
                disabled={isLoading || !policyText}
                variant="glow" 
                size="lg" 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    PrivBERT is Analyzing...
                  </>
                ) : (
                  <>Analyze with PrivBERT <Zap className="ml-2 h-4 w-4" /></>
                )}
              </Button>
              
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm text-foreground"
                >
                  {analysisResult}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-border/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "90%", label: "Users accept without reading" },
              { value: "18 min", label: "Average policy read time" },
              { value: "70+", label: "Third parties per session" },
              { value: "<30s", label: "PriXplainer analysis time" },
            ].map((stat, index) => (
              <motion.div key={stat.label}>
                <p className="text-2xl md:text-3xl font-black text-gradient">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} className="p-6 h-full hover:scale-105 transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Extension CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="text-2xl font-bold text-foreground mb-3">Coming Soon: Browser Extension</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get instant privacy insights on every website you visit.
            </p>
            <Button asChild variant="glow" size="lg">
              <Link to="/extension">
                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlowCard>
        </div>
      </AnimatedSection>
    </div>
  );
}