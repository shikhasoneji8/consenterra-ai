import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, CheckCircle, Eye, Fingerprint, 
  Copy, RefreshCw, ChevronDown, Info, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import type { ScanResult } from "@/types/scan";

interface ScanResultsProps {
  result: ScanResult;
  onScanAnother: () => void;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'green': return '🟢';
    case 'yellow': return '🟡';
    case 'red': return '🔴';
    default: return '⚪';
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'Low': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
    case 'Medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'High': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    default: return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

export default function ScanResults({ result, onScanAnother }: ScanResultsProps) {
  const riskColors = getRiskLevelColor(result.risk_level);

  const handleCopySummary = async () => {
    const summaryText = `
Website: ${result.domain}
Trust Score: ${result.score}/100
Risk Level: ${result.risk_level}

Summary: ${result.summary}

Immediate Risks:
${result.immediate_risks.map(r => `• ${r.text}`).join('\n')}

Recommended Actions:
${result.actions.map(a => `• ${a.title}: ${a.text}`).join('\n')}
    `.trim();
    
    await navigator.clipboard.writeText(summaryText);
    toast.success("Summary copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Top Summary Card */}
      <div 
        className="p-6 md:p-8 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 20px 50px -15px hsl(var(--glow-primary) / 0.15)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Results for</p>
            <h3 className="text-2xl font-bold text-foreground">{result.domain}</h3>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}<span className="text-lg text-muted-foreground">/100</span>
              </p>
            </div>
            
            {/* Risk Level Pill */}
            <div className={`px-4 py-2 rounded-xl ${riskColors.bg} ${riskColors.border} border`}>
              <p className={`text-lg font-semibold ${riskColors.text}`}>{result.risk_level} Risk</p>
            </div>
          </div>
        </div>
        
        <p className="text-lg text-foreground/90 leading-relaxed">{result.summary}</p>
      </div>

      {/* Immediate Risks */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <h4 className="text-lg font-semibold text-foreground">Immediate Risks</h4>
        </div>
        
        <ul className="space-y-3">
          {result.immediate_risks.map((risk, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-background/50"
            >
              <span className="text-lg mt-0.5">{getSeverityIcon(risk.severity)}</span>
              <span className="text-foreground/90">{risk.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Dark Patterns */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Dark Patterns</h4>
        </div>
        
        {result.dark_patterns.detected ? (
          <ul className="space-y-3">
            {result.dark_patterns.items.map((pattern, index) => (
              <li key={index} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="font-semibold text-red-400 mb-1">{pattern.type}</p>
                <p className="text-sm text-muted-foreground">{pattern.evidence}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-400">No obvious dark patterns detected</p>
          </div>
        )}
      </div>

      {/* Digital Footprint */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Fingerprint className="h-5 w-5 text-accent" />
          <h4 className="text-lg font-semibold text-foreground">Digital Footprint</h4>
        </div>
        
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {result.digital_footprint.chips.map((chip, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30"
            >
              {chip}
            </span>
          ))}
        </div>
        
        {/* Details */}
        <div className="space-y-3 mb-4">
          {result.digital_footprint.details.map((detail, index) => (
            <div key={index} className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-foreground text-sm mb-1">{detail.label}</p>
              <p className="text-sm text-muted-foreground">{detail.text}</p>
            </div>
          ))}
        </div>
        
        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground italic">{result.digital_footprint.note}</p>
        </div>
      </div>

      {/* What You Can Do */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h4 className="text-lg font-semibold text-foreground">What You Can Do</h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          {result.actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <p className="font-semibold text-foreground mb-1">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expand/Details Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value="details" 
          className="border rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
            borderColor: 'hsl(var(--border))',
          }}
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
            <span className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              See how we decided this
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Confidence Rating</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.confidence === 'High' ? 'bg-green-500/20 text-green-400' :
                  result.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {result.confidence}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                This analysis is based on visible page signals including meta tags, scripts, consent patterns, 
                and common tracking indicators. For a complete picture, always review the site's full privacy policy.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={handleCopySummary} variant="outline" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Summary
        </Button>
        <Button onClick={onScanAnother} variant="glow" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Scan Another Site
        </Button>
      </div>
    </motion.div>
  );
}
