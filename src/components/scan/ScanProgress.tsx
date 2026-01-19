import { motion } from "framer-motion";
import { CheckCircle, Globe, Shield, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ScanProgressProps {
  step: number;
}

const steps = [
  { icon: Globe, message: "Reading the page signals…" },
  { icon: Shield, message: "Checking tracking + consent patterns…" },
  { icon: FileText, message: "Summarizing risks…" },
];

export default function ScanProgress({ step }: ScanProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Top skeleton card – mimics results header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 md:p-8 rounded-2xl"
        style={{
          background:
            "linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 bg-muted/50" />
            <Skeleton className="h-8 w-48 bg-muted/50" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center space-y-2">
              <Skeleton className="h-3 w-16 bg-muted/50" />
              <Skeleton className="h-10 w-20 bg-muted/50" />
            </div>
            <Skeleton className="h-12 w-28 rounded-xl bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full bg-muted/50" />
          <Skeleton className="h-5 w-3/4 bg-muted/50" />
        </div>
      </motion.div>

      {/* Progress steps card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl"
        style={{
          background:
            "linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            Analyzing website...
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isComplete = index < step;
            const isCurrent = index === step;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-primary/10 border border-primary/30"
                    : isComplete
                    ? "bg-green-500/5"
                    : "bg-muted/20"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isComplete
                      ? "bg-green-500/20 text-green-400"
                      : isCurrent
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Icon
                      className={`h-5 w-5 ${
                        isCurrent ? "animate-pulse" : ""
                      }`}
                    />
                  )}
                </div>

                <span
                  className={`text-sm font-medium flex-1 ${
                    isCurrent
                      ? "text-foreground"
                      : isComplete
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.message}
                </span>

                {isCurrent && (
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: d,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Skeleton sections – mimic final result blocks */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="p-6 rounded-2xl"
          style={{
            background:
              "linear-gradient(145deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-5 w-5 rounded bg-muted/50" />
            <Skeleton className="h-5 w-40 bg-muted/50" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="p-3 rounded-xl bg-muted/20">
                <Skeleton className="h-4 w-full bg-muted/40" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}