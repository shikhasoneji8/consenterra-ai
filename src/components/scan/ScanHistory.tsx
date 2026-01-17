import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScanHistoryItem {
  id: string;
  url: string;
  risk_score: number;
  risk_level: string;
  summary: string | null;
  findings: unknown;
  scanned_at: string;
}

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'Low': return 'text-green-400 bg-green-500/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'High': return 'text-red-400 bg-red-500/20';
    default: return 'text-muted-foreground bg-muted';
  }
};

export default function ScanHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      // Using type assertion since scan_history table was just created
      const { data, error } = await supabase
        .from('scan_history' as 'profiles')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(10) as { data: ScanHistoryItem[] | null; error: Error | null };

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Using type assertion since scan_history table was just created
      const { error } = await supabase
        .from('scan_history' as 'profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Scan deleted");
    } catch (err) {
      console.error('Error deleting scan:', err);
      toast.error("Failed to delete scan");
    }
  };

  if (!user) return null;
  if (loading) return null;
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 w-full max-w-2xl mx-auto"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Your Scan History</span>
            <span className="text-sm text-muted-foreground">({history.length} scans)</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">{item.url}</span>
                        <a
                          href={`https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(item.risk_level)}`}>
                          {item.risk_level}
                        </span>
                        <span className="text-muted-foreground">
                          Score: {item.risk_score}/100
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(item.scanned_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
