import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top card skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 md:p-8 rounded-2xl bg-muted/20 border border-border/50"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
            <div className="h-8 w-40 bg-muted/50 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-20 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-muted/50 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
        </div>
      </motion.div>

      {/* Section skeletons */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-2xl bg-muted/20 border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-5 bg-muted/50 rounded animate-pulse" />
            <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="p-3 rounded-xl bg-muted/30">
                <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
