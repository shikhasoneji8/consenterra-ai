import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type PlanType = "free" | "basic" | "pro";

interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  status: string;
  price_monthly: number | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  scanCount: number;
  canScan: boolean;
  maxScans: number;
  upgradePlan: (plan: PlanType) => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const PLAN_LIMITS = {
  free: 2,
  basic: 50,
  pro: Infinity,
};

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanCount, setScanCount] = useState(0);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch subscription
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSubscription(subData as Subscription | null);

      // Fetch scan count
      const { count } = await supabase
        .from("scan_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setScanCount(count || 0);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const currentPlan: PlanType = subscription?.plan as PlanType || "free";
  const maxScans = PLAN_LIMITS[currentPlan];
  const canScan = scanCount < maxScans;

  const upgradePlan = async (plan: PlanType) => {
    if (!user) return;

    const priceMap = {
      free: null,
      basic: 2.99,
      pro: 6.99,
    };

    if (subscription) {
      // Update existing subscription
      await supabase
        .from("user_subscriptions")
        .update({
          plan,
          price_monthly: priceMap[plan],
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      // Create new subscription
      await supabase.from("user_subscriptions").insert({
        user_id: user.id,
        plan,
        price_monthly: priceMap[plan],
      });
    }

    await fetchSubscription();
  };

  return {
    subscription,
    loading,
    scanCount,
    canScan,
    maxScans,
    upgradePlan,
    refreshSubscription: fetchSubscription,
  };
};
