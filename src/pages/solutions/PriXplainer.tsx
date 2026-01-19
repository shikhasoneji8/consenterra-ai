// prixplainer.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ✅ Keep these imports EXACTLY as they exist in your current PriXplainer page.
// If any of these paths differ in your repo, replace them with your existing ones.
import AuroraBackground from "@/components/AuroraBackground";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import DemoCarousel from "@/components/DemoCarousel";
// import WebsiteRiskScan from "@/components/scan/WebsiteRiskScan";
import { Button } from "@/components/ui/button";

/** =========================================================
 * Marketing content (your original page data)
 * ========================================================= */
const demoSlides = [
  {
    title: "Paste Any Privacy Policy",
    description:
      "Simply paste the URL or text of any privacy policy or terms of service. PriXplainer works with policies from any website or app.",
    bullets: [
      "Works with any website or app policy",
      "Supports URLs or direct text paste",
      "Handles policies of any length",
    ],
    highlight:
      "Works with policies from Google, Facebook, Instagram, and thousands of other services.",
  },
  {
    title: "AI-Powered Analysis",
    description:
      "Our advanced AI engine reads and analyzes the entire document, identifying key clauses about data collection, sharing, and your rights.",
    bullets: [
      "Identifies data collection practices",
      "Flags third-party sharing",
      "Highlights your rights and opt-outs",
    ],
    highlight:
      "Powered by privacy-focused ontologies developed by legal and privacy experts.",
  },
  {
    title: "See Risk Indicators",
    description:
      "Visual severity indicators highlight concerning practices at a glance. Red flags for high-risk clauses, yellow for moderate concerns, and green for user-friendly terms.",
    bullets: [
      "🔴 High-risk clauses flagged in red",
      "🟡 Moderate concerns in yellow",
      "🟢 User-friendly terms in green",
    ],
    highlight:
      "Each risk is explained in plain language so you understand exactly what it means for you.",
  },
  {
    title: "Get Your Summary",
    description:
      "Receive a clear, human-readable summary of what the policy actually says about your data. No more legal jargon—just the facts you need to make informed decisions.",
    bullets: [
      "Plain-language explanations",
      "Key points highlighted",
      "Actionable recommendations",
    ],
    highlight:
      "Typical 18-minute read condensed to 2 minutes of actionable insights.",
  },
];

const features = [
  {
    title: "AI-Generated Summaries",
    description:
      "Get clear, concise summaries of privacy policies without legal jargon.",
  },
  {
    title: "Risk Indicators",
    description:
      "Visual risk and severity indicators highlight concerning practices.",
  },
  {
    title: "Ontology-Based Classification",
    description:
      "Advanced clause classification powered by privacy-focused ontologies.",
  },
  {
    title: "Human-Readable Insights",
    description: "User-centric explanations anyone can understand.",
  },
];

/** =========================================================
 * Analyzer UI (your big tool) integrated as a CHILD component
 * ========================================================= */

/** -----------------------------
 * Types
 * ----------------------------- */
type TopK = {
  label: string;
  prob: number;
};

type Row = {
  id: number; // sentence index/order from backend
  text: string; // policy sentence (source)
  label: string; // plain-language label
  confidence: number; // 0..1
  category: string;
  sub_category: string;
  fine_grained: string;
  rating: string; // good/bad/blocker/neutral
  action: string;
  top_k: TopK[];
};

type MergedRow = Row & {
  merged_ids?: number[];
};

type ViewMode = "cards" | "table";

/** -----------------------------
 * Icons (served from /public)
 * ----------------------------- */
const ICON_MAP: Record<string, string> = {
  good: "/icons/good.png",
  bad: "/icons/bad.png",
  blocker: "/icons/blocker.png",
  neutral: "/icons/neutral.png",
};

/** -----------------------------
 * Category color map
 * ----------------------------- */
const CATEGORY_COLOR_MAP: Record<string, string> = {
  "First Party Collection/Use": "cat-collection",
  "Third Party Sharing/Collection": "cat-sharing",
  "Data Security": "cat-security",
  "User Access, Edit and Deletion": "cat-access",
  "Policy Change": "cat-policy",
  "International and Specific Audiences": "cat-compliance",
  "Data Retention": "cat-retention",
  "Service Description": "cat-description",
  "Governing Law": "cat-law",
  "Dispute Resolution": "cat-dispute",
  "Limitation of Liability": "cat-liability",
  Indemnification: "cat-indemnity",
  Disclaimer: "cat-disclaimer",
  "Do Not Track": "cat-dnt",
  "User Choice": "cat-choice",
  "User Responsibility": "cat-user-resp",
  "Registration & Account Security": "cat-reg-sec",
  Misc: "cat-misc",
  Other: "cat-other",
};

function norm(s?: string) {
  return (s || "").trim();
}

function ratingKey(rating: string) {
  return norm(rating).toLowerCase() || "neutral";
}

function ratingLabel(rating: string) {
  const r = ratingKey(rating);
  if (r === "good") return "Good";
  if (r === "bad") return "Bad";
  if (r === "blocker") return "Blocker";
  return "Neutral";
}

function ratingClass(rating: string) {
  const r = ratingKey(rating);
  if (r === "good") return "badge-good";
  if (r === "bad") return "badge-bad";
  if (r === "blocker") return "badge-blocker";
  return "badge-neutral";
}

function ratingIcon(rating: string) {
  const r = ratingKey(rating);
  return ICON_MAP[r] || ICON_MAP.neutral;
}

function categoryClass(category: string) {
  const c = norm(category) || "Other";
  return CATEGORY_COLOR_MAP[c] || "cat-other";
}

function includesAny(haystack: string, needle: string) {
  const h = (haystack || "").toLowerCase();
  const n = (needle || "").toLowerCase().trim();
  if (!n) return true;
  return h.includes(n);
}

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(val: any) {
  const s = String(val ?? "");
  const needs = /[",\n]/.test(s);
  const out = s.replace(/"/g, '""');
  return needs ? `"${out}"` : out;
}

function safePct01To100(x?: number) {
  const v = Number.isFinite(x as number) ? (x as number) : 0;
  return Math.max(0, Math.min(100, v * 100));
}

/** -----------------------------
 * Grade helpers
 * ----------------------------- */
const VALID_RATINGS = new Set(["good", "bad", "blocker"]);

function determineCounts(rows: Row[]) {
  const counts = { good: 0, bad: 0, blocker: 0 };
  for (const r of rows) {
    const k = ratingKey(r.rating);
    if (VALID_RATINGS.has(k)) {
      // @ts-ignore
      counts[k] += 1;
    }
  }
  return counts;
}

function determineBalance(counts: { good: number; bad: number; blocker: number }) {
  return counts.good - counts.bad - counts.blocker * 3;
}

function calculateGrade(rows: Row[]) {
  const counts = determineCounts(rows);
  const total = counts.good + counts.bad + counts.blocker;
  if (total === 0) return "N/A";

  const balance = determineBalance(counts);

  if (balance <= -10 || counts.blocker > counts.good) return "E";
  if (counts.blocker >= 3 || counts.bad > counts.good) return "D";
  if (balance < 5) return "C";
  if (counts.bad > 0) return "B";
  return "A";
}

const GRADE_LABEL: Record<string, string> = {
  A: "Excellent",
  B: "Good",
  C: "Mixed",
  D: "Risky",
  E: "Poor",
};

function normalizeGrade(g?: string) {
  const x = (g || "").trim().toUpperCase();
  return ["A", "B", "C", "D", "E"].includes(x) ? x : "N/A";
}

function gradeChipClass(g?: string) {
  const x = normalizeGrade(g);
  return x === "N/A" ? "grade-chip-NA" : `grade-chip-${x}`;
}

function gradeLabelText(g?: string) {
  const x = normalizeGrade(g);
  return x === "N/A" ? "N/A" : GRADE_LABEL[x];
}

function idsToRange(ids: number[]) {
  if (!ids.length) return "";
  const sorted = [...ids].sort((a, b) => a - b);
  if (sorted.length === 1) return String(sorted[0]);
  return `${sorted[0]}–${sorted[sorted.length - 1]}`;
}

/** -----------------------------
 * Merge consecutive rows with same “case”
 * ----------------------------- */
function mergeConsecutiveSameCase(itemsOrdered: Row[], topKLimit = 5): MergedRow[] {
  if (!itemsOrdered.length) return [];

  const sameKey = (r: Row) =>
    [
      norm(r.label),
      norm(r.category),
      norm(r.sub_category),
      norm(r.fine_grained),
      ratingKey(r.rating),
      norm(r.action),
    ].join("|||");

  const averageTopK = (rows: Row[], k: number): TopK[] => {
    const agg = new Map<string, { sum: number; n: number }>();

    for (const r of rows) {
      for (const tk of r.top_k || []) {
        const key = norm(tk.label);
        if (!key) continue;
        const prev = agg.get(key) || { sum: 0, n: 0 };
        prev.sum += Number(tk.prob) || 0;
        prev.n += 1;
        agg.set(key, prev);
      }
    }

    return Array.from(agg.entries())
      .map(([label, v]) => ({ label, prob: v.n ? v.sum / v.n : 0 }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, k);
  };

  const merged: MergedRow[] = [];
  let cluster: Row[] = [itemsOrdered[0]];

  const flush = () => {
    if (!cluster.length) return;

    if (cluster.length === 1) {
      merged.push({ ...cluster[0], merged_ids: [cluster[0].id] });
      return;
    }

    const base = cluster[0];
    const mergedIds = cluster.map((r) => r.id);

    const avgConf =
      cluster.reduce((sum, r) => sum + (Number(r.confidence) || 0), 0) /
      Math.max(1, cluster.length);

    const joinedText = cluster
      .map((r) => norm(r.text))
      .filter(Boolean)
      .join("\n");

    merged.push({
      ...base,
      id: base.id,
      merged_ids: mergedIds,
      confidence: avgConf,
      text: joinedText,
      top_k: averageTopK(cluster, topKLimit),
    });
  };

  for (let i = 1; i < itemsOrdered.length; i++) {
    const cur = itemsOrdered[i];
    const prev = cluster[cluster.length - 1];
    if (sameKey(cur) === sameKey(prev)) cluster.push(cur);
    else {
      flush();
      cluster = [cur];
    }
  }
  flush();

  return merged;
}

/** =========================================================
 * Child component: PriXplainer Policy Analyzer Tool
 * ========================================================= */
function PriXplainerPolicyAnalyzer() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState<ViewMode>("cards");

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFine, setSelectedFine] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [onlyBadBlocker, setOnlyBadBlocker] = useState(false);
  const [search, setSearch] = useState("");

  const [summary, setSummary] = useState<string>("");
  const [minConfidencePct, setMinConfidencePct] = useState<number>(70);

  const [expandedTopK, setExpandedTopK] = useState<Record<number, boolean>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const hasRows = rows.length > 0;
  const { toast } = useToast();

  async function analyze() {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const sessionRes = await supabase.auth.getSession();
      const session = sessionRes.data.session;

      if (!session) {
        toast({
          title: "Login required",
          description: "Please log in to use PriXplainer",
          variant: "destructive",
        });
        return;
      }

      const email = session.user.email;

      const res = await fetch("/api/prixplainer/annotate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": email ?? "",
        },
        body: JSON.stringify({
          text,
          threshold: 0.0,
          top_k: 5,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const data = await res.json();
      setRows(data.rows || []);
      setSummary(data.summary || "");
    } catch (err: any) {
      toast({
        title: "PriXplainer",
        description: err.message?.includes("subscribe")
          ? "Free limit reached. Please subscribe to the Pro plan."
          : err.message || "Analyze failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSelectedCategory("All");
    setSelectedFine("All");
    setSelectedRating("All");
    setOnlyBadBlocker(false);
    setSearch("");
  }

  function toggleTopK(id: number) {
    setExpandedTopK((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAllTopK(list: MergedRow[]) {
    const next: Record<number, boolean> = {};
    for (const r of list) {
      if (r.top_k && r.top_k.length > 0) next[r.id] = true;
    }
    setExpandedTopK(next);
  }

  function collapseAllTopK() {
    setExpandedTopK({});
  }

  function setQuickRating(r: "good" | "bad" | "blocker" | "neutral" | "All") {
    setSelectedRating((prev) => (prev === r ? "All" : r));
  }

  function toggleCategoryCollapse(category: string) {
    setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  const ratingCountsAll = useMemo(() => {
    const counts = { good: 0, bad: 0, blocker: 0, neutral: 0 };
    for (const r of rows) {
      const k = ratingKey(r.rating);
      if (k === "good") counts.good += 1;
      else if (k === "bad") counts.bad += 1;
      else if (k === "blocker") counts.blocker += 1;
      else counts.neutral += 1;
    }
    return counts;
  }, [rows]);

  const categoryCountsAll = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const c = norm(r.category) || "Other";
      m.set(c, (m.get(c) || 0) + 1);
    }
    return m;
  }, [rows]);

  const fineCountsByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const cat = norm(r.category) || "Other";
      const fine = norm(r.fine_grained) || "Unmapped";
      const key = `${cat}|||${fine}`;
      m.set(key, (m.get(key) || 0) + 1);
    }
    return m;
  }, [rows]);

  const categoryOptions = useMemo(() => {
    const cats = Array.from(categoryCountsAll.keys()).sort((a, b) => a.localeCompare(b));
    return ["All", ...cats];
  }, [categoryCountsAll]);

  const fineOptions = useMemo(() => {
    const set = new Set<string>();

    const relevant =
      selectedCategory === "All"
        ? rows
        : rows.filter((r) => (norm(r.category) || "Other") === selectedCategory);

    for (const r of relevant) set.add(norm(r.fine_grained) || "Unmapped");

    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rows, selectedCategory]);

  const filteredRowsOrdered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const minConf = Math.max(0, Math.min(100, minConfidencePct)) / 100;

    const filtered = rows.filter((r) => {
      const cat = norm(r.category) || "Other";
      const fine = norm(r.fine_grained) || "Unmapped";
      const rate = ratingKey(r.rating);

      const catOk = selectedCategory === "All" || cat === selectedCategory;
      const fineOk = selectedFine === "All" || fine === selectedFine;

      const ratingOk = selectedRating === "All" || rate === selectedRating.toLowerCase();
      const badBlockerOk = !onlyBadBlocker || rate === "bad" || rate === "blocker";

      const confOk = (r.confidence ?? 0) >= minConf;

      const searchOk =
        !s ||
        includesAny(r.text, s) ||
        includesAny(r.label, s) ||
        includesAny(r.action, s) ||
        includesAny(r.sub_category, s) ||
        includesAny(r.fine_grained, s) ||
        includesAny(r.category, s);

      return catOk && fineOk && ratingOk && badBlockerOk && confOk && searchOk;
    });

    return [...filtered].sort((a, b) => a.id - b.id);
  }, [
    rows,
    selectedCategory,
    selectedFine,
    selectedRating,
    onlyBadBlocker,
    minConfidencePct,
    search,
  ]);

  const filteredCounts = useMemo(() => {
    const m = { good: 0, bad: 0, blocker: 0, neutral: 0 };
    for (const r of filteredRowsOrdered) {
      const k = ratingKey(r.rating);
      if (k === "good") m.good++;
      else if (k === "bad") m.bad++;
      else if (k === "blocker") m.blocker++;
      else m.neutral++;
    }
    return m;
  }, [filteredRowsOrdered]);

  const groupedByCategory = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of filteredRowsOrdered) {
      const c = norm(r.category) || "Other";
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(r);
    }

    return Array.from(m.entries())
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .map(([category, itemsOrdered]) => ({
        category,
        items: mergeConsecutiveSameCase(itemsOrdered, 5),
      }));
  }, [filteredRowsOrdered]);

  const mergedRows = useMemo(() => {
    const out: MergedRow[] = [];
    for (const g of groupedByCategory) out.push(...g.items);
    return out;
  }, [groupedByCategory]);

  const computedGrade = useMemo(() => normalizeGrade(calculateGrade(mergedRows)), [mergedRows]);

  function downloadFilteredCSV() {
    if (!mergedRows.length) return;

    const headers = [
      "merged_ids",
      "label",
      "source_text",
      "confidence",
      "category",
      "sub_category",
      "fine_grained",
      "rating",
      "action",
      "top_k",
    ];

    const lines = [headers.join(",")];

    for (const r of mergedRows) {
      const topk = (r.top_k || [])
        .map((t) => `${t.label} (${(t.prob * 100).toFixed(1)}%)`)
        .join(" | ");

      const mergedIdText = r.merged_ids?.length ? idsToRange(r.merged_ids) : String(r.id);

      const rowVals = [
        mergedIdText,
        r.label,
        r.text,
        (r.confidence ?? 0).toFixed(6),
        r.category,
        r.sub_category,
        r.fine_grained,
        r.rating,
        r.action,
        topk,
      ];

      lines.push(rowVals.map(csvEscape).join(","));
    }

    downloadTextFile("prixplainer_annotations.csv", lines.join("\n"), "text/csv");
  }

  function onChangeCategory(val: string) {
    setSelectedCategory(val);
    setSelectedFine("All");
  }

  return (
    <section className="py-16">
      <div className="section-container">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gradient">Try PriXplainer</h2>
          <p className="text-muted-foreground mt-2">
            Paste a policy, get clause-level insights, risk signals, and actions.
          </p>
        </AnimatedSection>

        <div className="p-6 max-w-7xl mx-auto space-y-6 text-foreground">
          <style>{`
            .pw-sticky {
              position: sticky;
              top: 12px;
              z-index: 20;
              backdrop-filter: blur(10px);
              background: hsl(var(--background) / 0.82);
              border: 1px solid hsl(var(--border) / 0.8);
              border-radius: 16px;
              box-shadow: 0 1px 12px hsl(var(--foreground) / 0.06);
              padding: 12px;
            }

            .pw-card {
              border: 1px solid hsl(var(--border) / 0.9);
              border-radius: 16px;
              padding: 16px;
              background: hsl(var(--card));
              color: hsl(var(--card-foreground));
              box-shadow: 0 1px 10px hsl(var(--foreground) / 0.05);
            }

            .pw-panel {
              border: 1px solid hsl(var(--border) / 0.9);
              border-radius: 16px;
              background: hsl(var(--card));
              color: hsl(var(--card-foreground));
              box-shadow: 0 1px 10px hsl(var(--foreground) / 0.05);
            }

            .pw-muted { color: hsl(var(--muted-foreground)); }
            .pw-label { font-weight: 900; font-size: 16px; line-height: 1.35; color: hsl(var(--foreground)); }

            .pw-source {
              font-size: 13px;
              color: hsl(var(--muted-foreground));
              margin-top: 6px;
              white-space: pre-wrap;
            }
            .pw-source b { color: hsl(var(--foreground)); }

            .pw-kv { font-size: 13px; }
            .pw-kv b { color: hsl(var(--foreground)); }
            .pw-divider { height: 1px; background: hsl(var(--border)); margin: 10px 0; }

            .pw-btn {
              border: 1px solid hsl(var(--border));
              border-radius: 10px;
              padding: 8px 10px;
              font-size: 12px;
              background: hsl(var(--background));
              color: hsl(var(--foreground));
              font-weight: 800;
            }
            .pw-btn:hover { background: hsl(var(--muted) / 0.6); }

            .pw-topk {
              border: 1px solid hsl(var(--border));
              border-radius: 12px;
              padding: 10px;
              background: hsl(var(--muted) / 0.4);
              font-size: 12px;
              color: hsl(var(--foreground));
            }

            .pw-progress {
              height: 8px;
              border-radius: 999px;
              background: hsl(var(--muted));
              overflow: hidden;
            }
            .pw-progress > div {
              height: 100%;
              background: hsl(var(--foreground) / 0.6);
            }

            .badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 7px 10px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 800;
              border: 1px solid hsl(var(--border));
              background: hsl(var(--muted) / 0.35);
              color: hsl(var(--foreground));
              white-space: nowrap;
              cursor: default;
              user-select: none;
            }
            .badge.clickable { cursor: pointer; }
            .badge.selected { outline: 2px solid hsl(var(--ring)); }

            .badge-good { color: hsl(142 70% 45%); background: hsl(142 70% 45% / 0.12); border-color: hsl(142 70% 45% / 0.25); }
            .badge-bad { color: hsl(35 90% 55%); background: hsl(35 90% 55% / 0.12); border-color: hsl(35 90% 55% / 0.25); }
            .badge-blocker { color: hsl(0 80% 60%); background: hsl(0 80% 60% / 0.12); border-color: hsl(0 80% 60% / 0.25); }
            .badge-neutral { color: hsl(var(--muted-foreground)); background: hsl(var(--muted) / 0.35); border-color: hsl(var(--border)); }

            .icon-bubble {
              width: 22px;
              height: 22px;
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              background: hsl(var(--muted) / 0.4);
              border: 1px solid hsl(var(--border));
            }
            .icon-bubble img { width: 14px; height: 14px; object-fit: contain; }

            .cat-pill {
              display: inline-flex;
              align-items: center;
              padding: 6px 10px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 800;
              border: 1px solid hsl(var(--border));
              background: hsl(var(--muted) / 0.35);
              white-space: nowrap;
            }

            .cat-collection { color: hsl(199 95% 55%); background: hsl(199 95% 55% / 0.10); border-color: hsl(199 95% 55% / 0.22); }
            .cat-sharing { color: hsl(270 85% 65%); background: hsl(270 85% 65% / 0.10); border-color: hsl(270 85% 65% / 0.22); }
            .cat-security { color: hsl(162 80% 45%); background: hsl(162 80% 45% / 0.10); border-color: hsl(162 80% 45% / 0.22); }
            .cat-access { color: hsl(215 90% 60%); background: hsl(215 90% 60% / 0.10); border-color: hsl(215 90% 60% / 0.22); }
            .cat-policy { color: hsl(35 95% 55%); background: hsl(35 95% 55% / 0.10); border-color: hsl(35 95% 55% / 0.22); }
            .cat-compliance { color: hsl(215 15% 70%); background: hsl(215 15% 70% / 0.10); border-color: hsl(215 15% 70% / 0.20); }
            .cat-retention { color: hsl(178 75% 45%); background: hsl(178 75% 45% / 0.10); border-color: hsl(178 75% 45% / 0.22); }
            .cat-description { color: hsl(243 85% 65%); background: hsl(243 85% 65% / 0.10); border-color: hsl(243 85% 65% / 0.22); }
            .cat-law { color: hsl(210 10% 70%); background: hsl(210 10% 70% / 0.10); border-color: hsl(210 10% 70% / 0.20); }
            .cat-dispute { color: hsl(330 75% 60%); background: hsl(330 75% 60% / 0.10); border-color: hsl(330 75% 60% / 0.22); }
            .cat-liability { color: hsl(20 85% 55%); background: hsl(20 85% 55% / 0.10); border-color: hsl(20 85% 55% / 0.22); }
            .cat-indemnity { color: hsl(270 70% 65%); background: hsl(270 70% 65% / 0.10); border-color: hsl(270 70% 65% / 0.22); }
            .cat-disclaimer { color: hsl(var(--muted-foreground)); background: hsl(var(--muted) / 0.35); border-color: hsl(var(--border)); }
            .cat-dnt { color: hsl(175 80% 45%); background: hsl(175 80% 45% / 0.10); border-color: hsl(175 80% 45% / 0.22); }
            .cat-choice { color: hsl(255 80% 70%); background: hsl(255 80% 70% / 0.10); border-color: hsl(255 80% 70% / 0.22); }
            .cat-user-resp { color: hsl(0 80% 60%); background: hsl(0 80% 60% / 0.08); border-color: hsl(0 80% 60% / 0.20); }
            .cat-reg-sec { color: hsl(165 80% 40%); background: hsl(165 80% 40% / 0.10); border-color: hsl(165 80% 40% / 0.22); }
            .cat-misc { color: hsl(215 10% 70%); background: hsl(215 10% 70% / 0.10); border-color: hsl(215 10% 70% / 0.20); }
            .cat-other { color: hsl(var(--muted-foreground)); background: hsl(var(--muted) / 0.35); border-color: hsl(var(--border)); }

            .pw-section {
              border: 1px solid hsl(var(--border));
              border-radius: 16px;
              background: hsl(var(--card));
              box-shadow: 0 1px 10px hsl(var(--foreground) / 0.05);
              overflow: hidden;
            }
            .pw-section-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 14px;
              background: hsl(var(--muted) / 0.35);
              border-bottom: 1px solid hsl(var(--border));
              cursor: pointer;
              user-select: none;
            }
            .pw-chevron {
              font-size: 14px;
              color: hsl(var(--muted-foreground));
              font-weight: 900;
            }

            .grade-chip {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 10px 12px;
              border-radius: 999px;
              color: white;
              font-weight: 800;
              box-shadow: 0 6px 14px hsl(var(--foreground) / 0.12);
            }
            .grade-chip .letter {
              width: 34px;
              height: 34px;
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              background: rgba(255,255,255,0.16);
              border: 1px solid rgba(255,255,255,0.25);
            }
            .grade-chip .meta {
              display: flex;
              flex-direction: column;
              line-height: 1.1;
            }
            .grade-chip .meta .title {
              font-size: 12px;
              opacity: 0.95;
            }
            .grade-chip .meta .label {
              font-size: 13px;
              font-weight: 900;
            }

            .grade-chip-A { background-color: #00704A; }
            .grade-chip-B { background-color: #1E88E5; }
            .grade-chip-C { background-color: #E6A700; }
            .grade-chip-D { background-color: #D9534F; }
            .grade-chip-E { background-color: #6C757D; }
            .grade-chip-NA { background-color: #94A3B8; }
          `}</style>

          {/* Input */}
          <div className="pw-card space-y-3">
            <div className="text-sm pw-muted">
              Paste policy text. Default view shows only labels with{" "}
              <b>confidence ≥ 70%</b>. Consecutive lines that map to the same
              label are automatically <b>merged into one card</b>.
            </div>

            <textarea
              className="w-full rounded-md border border-border bg-background text-foreground p-3 min-h-[140px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste privacy policy text here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={analyze}
                disabled={loading}
                className="px-6 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Analyzing…" : "Analyze"}
              </button>

              {summary ? <span className="text-sm pw-muted">{summary}</span> : null}
            </div>
          </div>

          {/* Sticky toolbar */}
          <div className="pw-sticky">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="pw-btn"
                onClick={downloadFilteredCSV}
                disabled={!hasRows || mergedRows.length === 0}
                title={
                  !hasRows
                    ? "Run Analyze first"
                    : mergedRows.length === 0
                    ? "No rows to export"
                    : ""
                }
              >
                Download CSV
              </button>

              {rows.length > 0 && (
                <div className={`grade-chip ${gradeChipClass(computedGrade)}`}>
                  <div className="letter">{normalizeGrade(computedGrade)}</div>
                  <div className="meta">
                    <div className="title">Overall Grade</div>
                    <div className="label">{gradeLabelText(computedGrade)}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm pw-muted">View:</span>
                <button
                  type="button"
                  onClick={() => setView("cards")}
                  className={`px-3 py-2 rounded border border-border text-sm font-bold ${
                    view === "cards"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                  disabled={!hasRows}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setView("table")}
                  className={`px-3 py-2 rounded border border-border text-sm font-bold ${
                    view === "table"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                  disabled={!hasRows}
                >
                  Table
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="pw-btn"
                  onClick={() => expandAllTopK(mergedRows)}
                  disabled={!hasRows || mergedRows.length === 0}
                >
                  Expand all Top-K
                </button>
                <button
                  type="button"
                  className="pw-btn"
                  onClick={collapseAllTopK}
                  disabled={!hasRows}
                >
                  Collapse Top-K
                </button>
              </div>

              {hasRows && (
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <span
                    className={`badge clickable badge-good ${
                      selectedRating === "good" ? "selected" : ""
                    }`}
                    onClick={() => setQuickRating("good")}
                  >
                    <span className="icon-bubble">
                      <img src={ICON_MAP.good} alt="good" />
                    </span>
                    Good {filteredCounts.good}/{ratingCountsAll.good}
                  </span>

                  <span
                    className={`badge clickable badge-bad ${
                      selectedRating === "bad" ? "selected" : ""
                    }`}
                    onClick={() => setQuickRating("bad")}
                  >
                    <span className="icon-bubble">
                      <img src={ICON_MAP.bad} alt="bad" />
                    </span>
                    Bad {filteredCounts.bad}/{ratingCountsAll.bad}
                  </span>

                  <span
                    className={`badge clickable badge-blocker ${
                      selectedRating === "blocker" ? "selected" : ""
                    }`}
                    onClick={() => setQuickRating("blocker")}
                  >
                    <span className="icon-bubble">
                      <img src={ICON_MAP.blocker} alt="blocker" />
                    </span>
                    Blocker {filteredCounts.blocker}/{ratingCountsAll.blocker}
                  </span>

                  <span
                    className={`badge clickable badge-neutral ${
                      selectedRating === "neutral" ? "selected" : ""
                    }`}
                    onClick={() => setQuickRating("neutral")}
                  >
                    <span className="icon-bubble">
                      <img src={ICON_MAP.neutral} alt="neutral" />
                    </span>
                    Neutral {filteredCounts.neutral}/{ratingCountsAll.neutral}
                  </span>
                </div>
              )}
            </div>

            {hasRows && (
              <div className="pt-2 text-sm pw-muted">
                Showing{" "}
                <b className="text-foreground">{mergedRows.length}</b> cards
                (merged) from{" "}
                <b className="text-foreground">{filteredRowsOrdered.length}</b>{" "}
                matching lines
              </div>
            )}
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
            {/* LEFT PANEL */}
            <div className="pw-panel p-4 space-y-4 lg:sticky lg:top-5 h-fit">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Filters</div>
                <button
                  type="button"
                  className="pw-btn"
                  onClick={() => {
                    clearFilters();
                    setMinConfidencePct(70);
                  }}
                  disabled={!hasRows}
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="space-y-1">
                <div className="text-sm pw-muted">Search</div>
                <input
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Search label, source text, action…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={!hasRows}
                />
              </div>

              {/* Only bad/blocker */}
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={onlyBadBlocker}
                  onChange={(e) => setOnlyBadBlocker(e.target.checked)}
                  disabled={!hasRows}
                />
                Only Bad/Blocker
              </label>

              {/* Confidence slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="pw-muted">Min confidence</span>
                  <span className="font-semibold">{minConfidencePct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={minConfidencePct}
                  onChange={(e) => setMinConfidencePct(Number(e.target.value))}
                  disabled={!hasRows}
                  className="w-full"
                />
                <div className="text-xs pw-muted">
                  Default is <b>70%</b>. Slide down to include lower confidence.
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <div className="text-sm pw-muted">Rating</div>
                <select
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  disabled={!hasRows}
                >
                  <option value="All">All</option>
                  <option value="good">Good</option>
                  <option value="bad">Bad</option>
                  <option value="blocker">Blocker</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <div className="text-sm pw-muted">Category</div>
                <select
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => onChangeCategory(e.target.value)}
                  disabled={!hasRows}
                >
                  {categoryOptions.map((c) => {
                    if (c === "All")
                      return (
                        <option key="All" value="All">
                          All ({rows.length})
                        </option>
                      );
                    const n = categoryCountsAll.get(c) || 0;
                    return (
                      <option key={c} value={c}>
                        {c} ({n})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Fine-grained */}
              <div className="space-y-1">
                <div className="text-sm pw-muted">Fine-grained</div>
                <select
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm"
                  value={selectedFine}
                  onChange={(e) => setSelectedFine(e.target.value)}
                  disabled={!hasRows}
                >
                  {fineOptions.map((f) => {
                    if (f === "All") {
                      const relevantTotal =
                        selectedCategory === "All"
                          ? rows.length
                          : categoryCountsAll.get(selectedCategory) || 0;
                      return (
                        <option key="AllFine" value="All">
                          All ({relevantTotal})
                        </option>
                      );
                    }

                    if (selectedCategory === "All") {
                      let total = 0;
                      for (const [key, val] of fineCountsByCategory.entries()) {
                        const parts = key.split("|||");
                        if (parts.length === 2 && parts[1] === f) total += val;
                      }
                      return (
                        <option key={f} value={f}>
                          {f} ({total})
                        </option>
                      );
                    }

                    const key = `${selectedCategory}|||${f}`;
                    const n = fineCountsByCategory.get(key) || 0;
                    return (
                      <option key={f} value={f}>
                        {f} ({n})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* RIGHT: RESULTS */}
            <div className="space-y-4">
              {hasRows && mergedRows.length === 0 && (
                <div className="border border-border rounded p-4 bg-muted/40 text-muted-foreground">
                  No results match your filters. Try lowering confidence or clearing filters.
                </div>
              )}

              {/* CARDS */}
              {view === "cards" ? (
                <div className="space-y-4">
                  {groupedByCategory.map(({ category, items }) => {
                    const collapsed = !!collapsedCategories[category];
                    return (
                      <div key={category} className="pw-section">
                        <div
                          className="pw-section-header"
                          onClick={() => toggleCategoryCollapse(category)}
                          role="button"
                          aria-label={`Toggle category ${category}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`cat-pill ${categoryClass(category)}`}>
                              {category}
                            </span>
                            <span className="text-sm pw-muted">({items.length})</span>
                          </div>
                          <div className="pw-chevron">{collapsed ? "▶" : "▼"}</div>
                        </div>

                        {!collapsed && (
                          <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {items.map((row) => {
                              const confPct = safePct01To100(row.confidence);
                              const mergedIdText = row.merged_ids?.length
                                ? idsToRange(row.merged_ids)
                                : String(row.id);
                              const mergedCount = row.merged_ids?.length
                                ? row.merged_ids.length
                                : 1;

                              return (
                                <div key={row.id} className="pw-card space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`badge ${ratingClass(row.rating)}`}>
                                        <span className="icon-bubble">
                                          <img
                                            src={ratingIcon(row.rating)}
                                            alt={ratingKey(row.rating)}
                                          />
                                        </span>
                                        {ratingLabel(row.rating)}
                                      </span>

                                      <span className="text-xs pw-muted">
                                        #{mergedIdText}
                                        {mergedCount > 1
                                          ? ` · merged ${mergedCount} lines`
                                          : ""}
                                      </span>
                                    </div>

                                    <div className="text-xs pw-muted">
                                      {confPct.toFixed(1)}%
                                    </div>
                                  </div>

                                  <div className="pw-label">{row.label}</div>

                                  <div className="pw-source">
                                    <b>Source:</b>
                                    {"\n"}
                                    {row.text}
                                  </div>

                                  <div className="pw-progress" aria-label="confidence bar">
                                    <div style={{ width: `${confPct}%` }} />
                                  </div>

                                  <div className="pw-kv">
                                    <b>Fine-grained:</b>{" "}
                                    {norm(row.fine_grained) || "Unmapped"}
                                  </div>

                                  <div className="pw-kv">
                                    <b>Sub-category:</b>{" "}
                                    {norm(row.sub_category) || "Unmapped"}
                                  </div>

                                  <div className="pw-divider" />

                                  <div className="pw-kv">
                                    <b>Action:</b> {row.action}
                                  </div>

                                  <div className="flex items-center justify-between pt-1">
                                    <button
                                      type="button"
                                      className="pw-btn"
                                      onClick={() => toggleTopK(row.id)}
                                      disabled={!row.top_k || row.top_k.length === 0}
                                      title={
                                        !row.top_k || row.top_k.length === 0
                                          ? "No Top-K available"
                                          : ""
                                      }
                                    >
                                      {expandedTopK[row.id]
                                        ? "Hide Top-K"
                                        : "Show Top-K"}
                                    </button>

                                    {row.top_k?.length ? (
                                      <span className="text-xs pw-muted">
                                        Top-K: {row.top_k.length}
                                      </span>
                                    ) : null}
                                  </div>

                                  {expandedTopK[row.id] && row.top_k?.length > 0 && (
                                    <div className="pw-topk space-y-2">
                                      {row.top_k.map((t, idx) => (
                                        <div
                                          key={`${row.id}-${idx}`}
                                          className="flex gap-3"
                                        >
                                          <div className="w-12 text-xs pw-muted">
                                            {(t.prob * 100).toFixed(1)}%
                                          </div>
                                          <div className="text-xs">{t.label}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE */
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr className="text-left">
                        <th className="p-3 border-b border-border">#</th>
                        <th className="p-3 border-b border-border">Label</th>
                        <th className="p-3 border-b border-border">Source</th>
                        <th className="p-3 border-b border-border">Category</th>
                        <th className="p-3 border-b border-border">Fine-grained</th>
                        <th className="p-3 border-b border-border">Sub-category</th>
                        <th className="p-3 border-b border-border">Confidence</th>
                        <th className="p-3 border-b border-border">Rating</th>
                        <th className="p-3 border-b border-border">Action</th>
                        <th className="p-3 border-b border-border">Top-K</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mergedRows.map((row) => {
                        const confPct = safePct01To100(row.confidence);
                        const mergedIdText = row.merged_ids?.length
                          ? idsToRange(row.merged_ids)
                          : String(row.id);

                        return (
                          <tr key={row.id} className="align-top">
                            <td className="p-3 border-b border-border">{mergedIdText}</td>
                            <td className="p-3 border-b border-border font-semibold">{row.label}</td>

                            <td
                              className="p-3 border-b border-border"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {row.text}
                            </td>

                            <td className="p-3 border-b border-border">
                              <span className={`cat-pill ${categoryClass(row.category)}`}>
                                {norm(row.category) || "Other"}
                              </span>
                            </td>

                            <td className="p-3 border-b border-border">{norm(row.fine_grained) || "Unmapped"}</td>
                            <td className="p-3 border-b border-border">{norm(row.sub_category) || "Unmapped"}</td>

                            <td className="p-3 border-b border-border">
                              <div className="flex items-center gap-2">
                                <div className="w-14 text-xs">{confPct.toFixed(1)}%</div>
                                <div className="pw-progress w-32">
                                  <div style={{ width: `${confPct}%` }} />
                                </div>
                              </div>
                            </td>

                            <td className="p-3 border-b border-border">
                              <span className={`badge ${ratingClass(row.rating)}`}>
                                <span className="icon-bubble">
                                  <img src={ratingIcon(row.rating)} alt={ratingKey(row.rating)} />
                                </span>
                                {ratingLabel(row.rating)}
                              </span>
                            </td>

                            <td className="p-3 border-b border-border">{row.action}</td>

                            <td className="p-3 border-b border-border">
                              <button
                                type="button"
                                className="pw-btn"
                                onClick={() => toggleTopK(row.id)}
                                disabled={!row.top_k || row.top_k.length === 0}
                              >
                                {expandedTopK[row.id] ? "Hide" : "Show"}
                              </button>

                              {expandedTopK[row.id] && row.top_k?.length > 0 && (
                                <div className="pw-topk mt-2 space-y-2">
                                  {row.top_k.map((t, idx) => (
                                    <div key={`${row.id}-${idx}`} className="flex gap-3">
                                      <div className="w-12 text-xs pw-muted">
                                        {(t.prob * 100).toFixed(1)}%
                                      </div>
                                      <div className="text-xs">{t.label}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** =========================================================
 * Default export: Your original marketing PriXplainer page
 * with the analyzer tool embedded
 * ========================================================= */
export default function PriXplainer() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <AuroraBackground showParticles={false} />
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ boxShadow: "0 0 40px hsl(270 80% 60% / 0.3)" }}
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
              PriXplainer
            </h1>
            <p className="text-xl text-primary/80 font-medium mb-4">
              Understand before you consent.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              PriXplainer decodes privacy policies and terms of service using
              AI-driven analysis, risk indicators, and human-readable
              summaries—making invisible data practices visible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-6 border-destructive/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  The Problem
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Over 90% of users accept terms without reading them. The
                  average privacy policy takes 18 minutes to read, and a single
                  browsing session can share your data with 70+ third parties.
                  You deserve to know what you're agreeing to.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* Features */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient">Key Capabilities</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} delay={i * 0.1} className="p-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <DemoCarousel
        slides={demoSlides}
        title="See PriXplainer in Action"
        subtitle="Discover how PriXplainer transforms complex privacy policies into clear, actionable insights."
      />

      {/* Website Risk Scan Tool */}
      {/* <WebsiteRiskScan /> */}

      {/* ✅ Integrated Policy Analyzer Tool */}
      <PriXplainerPolicyAnalyzer />

      {/* Extension CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container">
          <GlowCard className="max-w-3xl mx-auto p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Coming Soon: Browser Extension
            </h3>
            <p className="text-muted-foreground mb-6">
              Get instant privacy insights on any website you visit. See risk
              scores before you click "Accept".
            </p>
            <Button asChild variant="glow">
              <Link to="/extension">
                Learn More & Join Waitlist{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlowCard>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-16">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to understand your privacy?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact us to learn more about PriXplainer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="glow">
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/solutions">View All Solutions</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}