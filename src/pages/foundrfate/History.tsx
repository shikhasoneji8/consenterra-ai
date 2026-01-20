import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  History as HistoryIcon, 
  Rocket, 
  DollarSign,
  Calendar,
  ChevronRight,
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface PitchWithDeals {
  id: string;
  created_at: string;
  startup_name: string | null;
  ask_amount: number;
  equity_percent: number;
  panels: {
    id: string;
    deals: {
      id: string;
      status: string;
      deal_terms: {
        total_raised: number;
        deal_grade: string;
      };
    }[];
  }[];
}

export default function History() {
  const { user } = useAuth();
  const [pitches, setPitches] = useState<PitchWithDeals[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('pitches')
          .select(`
            id,
            created_at,
            startup_name,
            ask_amount,
            equity_percent,
            panels (
              id,
              deals (
                id,
                status,
                deal_terms
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setPitches(data as unknown as PitchWithDeals[]);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'paid':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'declined':
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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HistoryIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Pitch History</h1>
          <p className="text-muted-foreground text-lg">
            Your past pitches and deals
          </p>
        </motion.div>

        {/* New Pitch Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Button asChild>
            <Link to="/solutions/foundrfate/new">
              <Plus className="w-4 h-4 mr-2" />
              New Pitch
            </Link>
          </Button>
        </motion.div>

        {/* Pitch List */}
        {pitches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="py-12 text-center">
                <Rocket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No pitches yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first pitch to see it here
                </p>
                <Button asChild>
                  <Link to="/solutions/foundrfate/new">Create First Pitch</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch, index) => {
              const latestDeal = pitch.panels[0]?.deals[0];
              const status = latestDeal?.status || 'pending';
              const totalRaised = latestDeal?.deal_terms?.total_raised || 0;

              return (
                <motion.div
                  key={pitch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            {pitch.startup_name || 'Unnamed Startup'}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(pitch.created_at), 'MMM d, yyyy')}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ask: </span>
                            <span className="font-medium">${pitch.ask_amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Equity: </span>
                            <span className="font-medium">{pitch.equity_percent}%</span>
                          </div>
                          {totalRaised > 0 && (
                            <div className="flex items-center gap-1 text-green-500">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium">${totalRaised.toLocaleString()} raised</span>
                            </div>
                          )}
                        </div>
                        {latestDeal && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/solutions/foundrfate/deal/${latestDeal.id}`}>
                              View Deal
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                        {!latestDeal && pitch.panels[0] && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/solutions/foundrfate/panel/${pitch.panels[0].id}`}>
                              View Panel
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
