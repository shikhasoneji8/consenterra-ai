import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Zap,
  Eye,
  Lock,
  Share2,
  Clock,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { analyzePrivacyPolicy, analyzePrivacyText, askPolicyQuestion } from "@/services/prixplainerApi";
import type { PriXplainerResult, PrivacyClause, QAResult } from "@/services/prixplainerApi";
import GlowCard from "@/components/GlowCard";

type ScanMode = 'url' | 'text';
type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

// Grade color mapping
const gradeColors: Record<string, { bg: string; text: string; glow: string }> = {
  'A': { bg: 'bg-emerald-500', text: 'text-emerald-500', glow: 'shadow-emerald-500/50' },
  'B': { bg: 'bg-lime-500', text: 'text-lime-500', glow: 'shadow-lime-500/50' },
  'C': { bg: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-yellow-500/50' },
  'D': { bg: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-500/50' },
  'F': { bg: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/50' },
  'N/A': { bg: 'bg-gray-500', text: 'text-gray-500', glow: 'shadow-gray-500/50' },
};

// Severity badge component
function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Low Risk' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Medium Risk' },
    high: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'High Risk' },
  };
  const { bg, text, label } = config[severity];
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

// Progress animation during scan
function ScanningAnimation() {
  const steps = [
    { icon: Search, label: "Fetching policy..." },
    { icon: FileText, label: "Extracting text..." },
    { icon: Zap, label: "Running AI analysis..." },
    { icon: Shield, label: "Generating report..." },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  
  useState(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <GlowCard className="p-8 text-center">
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center"
          animate={{ 
            rotate: 360,
            boxShadow: ['0 0 20px hsl(270 80% 60% / 0.3)', '0 0 40px hsl(270 80% 60% / 0.5)', '0 0 20px hsl(270 80% 60% / 0.3)']
          }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, boxShadow: { duration: 1.5, repeat: Infinity } }}
        >
          <Shield className="h-10 w-10 text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2">Analyzing Privacy Policy</h3>
        <p className="text-muted-foreground mb-6">Our AI is examining the policy for privacy risks...</p>
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <motion.div
                key={step.label}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive ? 'bg-primary/20 border border-primary/30' : 
                  isComplete ? 'bg-emerald-500/10' : 'bg-muted/30'
                }`}
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-primary text-white' :
                  isComplete ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? <Check className="h-4 w-4" /> : 
                   isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                   <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-sm ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </GlowCard>
    </motion.div>
  );
}

// Results display component
function ResultsDisplay({ 
  result, 
  onScanAnother,
  policyText 
}: { 
  result: PriXplainerResult; 
  onScanAnother: () => void;
  policyText: string;
}) {
  const [expandedClauses, setExpandedClauses] = useState<number[]>([]);
  const [showAllClauses, setShowAllClauses] = useState(false);
  const [question, setQuestion] = useState("");
  const [qaResult, setQaResult] = useState<QAResult | null>(null);
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const gradeStyle = gradeColors[result.grade] || gradeColors['N/A'];
  const displayedClauses = showAllClauses ? result.clauses : result.clauses.slice(0, 5);
  
  const toggleClause = (id: number) => {
    setExpandedClauses(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !policyText) return;
    
    setAskingQuestion(true);
    try {
      const answer = await askPolicyQuestion(question, policyText);
      setQaResult(answer);
    } catch (error) {
      toast.error("Couldn't get an answer. Please try again.");
    } finally {
      setAskingQuestion(false);
    }
  };

  const copyReport = () => {
    const report = `Privacy Policy Analysis Report
Grade: ${result.grade} - ${result.gradeDescription}
Total Clauses Analyzed: ${result.totalClauses}

Risk Breakdown:
- High Risk: ${result.riskBreakdown.high}
- Medium Risk: ${result.riskBreakdown.medium}
- Low Risk: ${result.riskBreakdown.low}

Generated by PriXplainer - ConsenTerra`;
    
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Report copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Grade Card */}
      <GlowCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Grade Circle */}
          <motion.div
            className={`w-28 h-28 rounded-full ${gradeStyle.bg} flex items-center justify-center shadow-2xl ${gradeStyle.glow}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <span className="text-5xl font-black text-white">{result.grade}</span>
          </motion.div>
          
          {/* Grade Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-2">Privacy Grade</h3>
            <p className={`text-lg font-medium ${gradeStyle.text}`}>{result.gradeDescription}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Analyzed {result.totalClauses} clauses from the privacy policy
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyReport}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onScanAnother}>
              Scan Another
            </Button>
          </div>
        </div>
      </GlowCard>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Risk', count: result.riskBreakdown.high, color: 'from-red-500 to-red-600', icon: XCircle },
          { label: 'Medium Risk', count: result.riskBreakdown.medium, color: 'from-yellow-500 to-orange-500', icon: AlertTriangle },
          { label: 'Low Risk', count: result.riskBreakdown.low, color: 'from-emerald-500 to-green-500', icon: CheckCircle },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <GlowCard className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-foreground">{item.count}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Topic Summary */}
      {Object.keys(result.topicSummary).length > 0 && (
        <GlowCard className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Topics Detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.topicSummary).map(([topic, count]) => (
              <Badge key={topic} variant="secondary" className="px-3 py-1">
                {topic}: {count}
              </Badge>
            ))}
          </div>
        </GlowCard>
      )}

      {/* Clauses List */}
      <GlowCard className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Analyzed Clauses ({result.clauses.length})
        </h4>
        
        <div className="space-y-3">
          {displayedClauses.map((clause, index) => (
            <motion.div
              key={clause.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleClause(clause.id)}
                className="w-full p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <SeverityBadge severity={clause.severity} />
                    <Badge variant="outline" className="text-xs">{clause.topic}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(clause.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{clause.sentence}</p>
                </div>
                {expandedClauses.includes(clause.id) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedClauses.includes(clause.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50 bg-muted/20"
                  >
                    <div className="p-4">
                      <p className="text-sm text-foreground mb-3">{clause.sentence}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <span className="ml-2 text-foreground">{clause.fine_category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="ml-2 text-foreground">{Math.round(clause.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {result.clauses.length > 5 && (
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setShowAllClauses(!showAllClauses)}
          >
            {showAllClauses ? 'Show Less' : `Show All ${result.clauses.length} Clauses`}
            {showAllClauses ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </GlowCard>

      {/* Q&A Section */}
      <GlowCard className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Ask About This Policy
        </h4>
        
        <div className="flex gap-3">
          <Input
            placeholder="e.g., How is my data shared with third parties?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            className="flex-1"
          />
          <Button onClick={handleAskQuestion} disabled={askingQuestion || !question.trim()}>
            {askingQuestion ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
          </Button>
        </div>
        
        {qaResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20"
          >
            <p className="text-foreground">{qaResult.answer}</p>
            {qaResult.confidence > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Confidence: {Math.round(qaResult.confidence * 100)}%
              </p>
            )}
          </motion.div>
        )}
      </GlowCard>
    </motion.div>
  );
}

// Main Scanner Component
export default function PriXplainerScanner() {
  const { user } = useAuth();
  const [mode, setMode] = useState<ScanMode>('url');
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<PriXplainerResult | null>(null);
  const [policyText, setPolicyText] = useState("");

  const handleScan = async () => {
    const input = mode === 'url' ? url : text;
    
    if (!input.trim()) {
      toast.error(mode === 'url' ? "Please enter a URL" : "Please paste some policy text");
      return;
    }

    if (mode === 'url') {
      try {
        new URL(input);
      } catch {
        toast.error("Please enter a valid URL");
        return;
      }
    }

    setStatus('scanning');
    setResult(null);

    try {
      let analysisResult: PriXplainerResult;
      
      if (mode === 'url') {
        analysisResult = await analyzePrivacyPolicy(input);
        setPolicyText(""); // We don't have the text for URL scans
      } else {
        analysisResult = await analyzePrivacyText(input);
        setPolicyText(input);
      }
      
      setResult(analysisResult);
      setStatus('complete');
      toast.success("Analysis complete!");
      
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Analysis failed. Please try again.");
      setStatus('error');
    }
  };

  const handleScanAnother = () => {
    setStatus('idle');
    setResult(null);
    setUrl("");
    setText("");
    setPolicyText("");
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by PrivBERT AI</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Privacy Policy</span> Analyzer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste a URL or privacy policy text. Our AI will analyze it and show you exactly what it means for your data.
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <GlowCard className="p-6 md:p-8">
                <Tabs value={mode} onValueChange={(v) => setMode(v as ScanMode)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="url" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Scan URL
                    </TabsTrigger>
                    <TabsTrigger value="text" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Paste Text
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Privacy Policy URL
                        </label>
                        <Input
                          placeholder="https://example.com/privacy-policy"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                          className="h-12 text-base"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the direct URL to a privacy policy page. Works with most websites.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Privacy Policy Text
                        </label>
                        <Textarea
                          placeholder="Paste the privacy policy text here..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="min-h-[200px] text-sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Copy and paste the full privacy policy text for analysis.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleScan} 
                  className="w-full h-12 text-base font-semibold mt-6"
                  variant="glow"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Analyze Privacy Policy
                </Button>

                {!user && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    <Lock className="inline h-3 w-3 mr-1" />
                    Sign in to save your scan history
                  </p>
                )}
              </GlowCard>
            </motion.div>
          ) : status === 'scanning' ? (
            <ScanningAnimation key="scanning" />
          ) : status === 'complete' && result ? (
            <ResultsDisplay 
              key="results" 
              result={result} 
              onScanAnother={handleScanAnother}
              policyText={policyText}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
