import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";

const funFacts = [
  // Privacy
  {
    category: "Privacy",
    fact: "Over 90% of users accept terms without reading them.",
    color: "from-primary to-forest-light",
  },
  {
    category: "Privacy",
    fact: "The average privacy policy takes 18 minutes to read.",
    color: "from-primary to-forest-light",
  },
  {
    category: "Privacy",
    fact: "A single browsing session can share your data with 70+ third parties.",
    color: "from-primary to-forest-light",
  },
  // Startups
  {
    category: "Startups",
    fact: "Most founders fail due to decision blind spots, not lack of ideas.",
    color: "from-ocean to-primary",
  },
  {
    category: "Startups",
    fact: "Only 1 in 10 startups succeed, but clarity increases those odds.",
    color: "from-ocean to-primary",
  },
  {
    category: "Startups",
    fact: "Early-stage founders spend 40% of their time on non-core tasks.",
    color: "from-ocean to-primary",
  },
  // Sustainability
  {
    category: "Sustainability",
    fact: "The smallest daily swaps often create the largest lifetime impact.",
    color: "from-earth to-sage",
  },
  {
    category: "Sustainability",
    fact: "If everyone made one sustainable swap daily, it would save 365 billion tons of CO₂ annually.",
    color: "from-earth to-sage",
  },
  {
    category: "Sustainability",
    fact: "80% of a product's environmental impact is determined at the design phase.",
    color: "from-earth to-sage",
  },
];

export default function FunFactCard() {
  const [currentFact, setCurrentFact] = useState(funFacts[0]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Get a fact based on the current day
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const factIndex = dayOfYear % funFacts.length;
    setCurrentFact(funFacts[factIndex]);
  }, []);

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setCurrentFact(funFacts[randomIndex]);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-forest-light p-6 flex flex-col items-center justify-center text-center shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Lightbulb className="h-12 w-12 text-primary-foreground mb-4 animate-pulse-gentle" />
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">
              Fun Fact of the Day
            </h3>
            <p className="text-sm text-primary-foreground/80">
              Click to reveal today's insight
            </p>
            <span className="mt-4 px-3 py-1 bg-primary-foreground/20 rounded-full text-xs text-primary-foreground">
              {currentFact.category}
            </span>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${currentFact.color} p-6 flex flex-col items-center justify-center text-center shadow-lg`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="px-3 py-1 bg-primary-foreground/20 rounded-full text-xs text-primary-foreground mb-4">
              {currentFact.category}
            </span>
            <p className="text-lg font-medium text-primary-foreground leading-relaxed">
              "{currentFact.fact}"
            </p>
            <p className="text-sm text-primary-foreground/70 mt-4">
              Click to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Shuffle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          getRandomFact();
        }}
        className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Shuffle fact
      </button>
    </div>
  );
}
