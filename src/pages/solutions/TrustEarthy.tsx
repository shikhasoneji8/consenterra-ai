import { useState } from "react";
import { X, ShoppingCart, Leaf, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DemoCarousel from "@/components/DemoCarousel";

const demoSlides = [
  {
    title: "Browse the 30-Day Challenge",
    description: "Each day reveals a new sustainable swap—from water bottles to cleaning products. Open doors to discover what everyday items you can replace.",
    highlight: "Start anywhere! Each swap is independent and easy to adopt."
  },
  {
    title: "Learn Why It Matters",
    description: "Every swap comes with clear impact metrics. See exactly how much plastic, carbon, or money you'll save by making the switch.",
    highlight: "No greenwashing—just honest, researched facts about each product."
  },
  {
    title: "Shop Sustainably",
    description: "Found a swap you love? Click through to find trusted sustainable alternatives. We curate options so you don't have to research endlessly.",
    highlight: "Direct links to quality products that actually make a difference."
  },
  {
    title: "Build Lasting Habits",
    description: "Small changes compound into big impact. Track your progress and watch your environmental footprint shrink over 30 days and beyond.",
    highlight: "Designed for real life—practical swaps anyone can make."
  }
];

interface SwapData {
  day_number: number;
  conventional_product: {
    name: string;
    description: string;
  };
  sustainable_alternative: {
    name: string;
    metrics: string[];
    purchase_link_query: string;
  };
}

const swapData: SwapData[] = [
  {
    day_number: 1,
    conventional_product: {
      name: "Single-Use Plastic Water Bottles",
      description: "Bought for convenience, used for minutes, and take 450+ years to decompose in landfills or oceans."
    },
    sustainable_alternative: {
      name: "Reusable Stainless Steel or Glass Water Bottle",
      metrics: [
        "Waste Reduction: Replaces hundreds of disposable plastic bottles every year per person.",
        "Healthier: Stainless steel and glass don't leach chemicals like BPA or antimony into your water, especially in heat.",
        "Saves Money: Tap water is virtually free; bottled water is a 2000% markup.",
        "Better Experience: Insulated bottles keep water ice-cold for 24 hours, unlike warm plastic bottles."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=insulated+stainless+steel+water+bottle"
    }
  },
  {
    day_number: 2,
    conventional_product: {
      name: "Plastic Grocery Bags",
      description: "Thin, flimsy bags used for the drive home that clog recycling machinery and pollute landscapes."
    },
    sustainable_alternative: {
      name: "Reusable Cloth or Durable Tote Bags",
      metrics: [
        "Massive Impact: One reusable bag can replace roughly 700 disposable plastic bags over its lifetime.",
        "Stronger: No more double-bagging; these hold far more weight without ripping.",
        "Recycling Friendly: Keeps plastic film out of curbside recycling bins where it causes expensive machinery jams.",
        "Versatile: Useful for more than just groceries—great for beach trips, carrying books, etc."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=heavy+duty+reusable+grocery+bags"
    }
  },
  {
    day_number: 3,
    conventional_product: {
      name: "Disposable Coffee Cups",
      description: "Paper cups lined with a hidden layer of polyethylene plastic, making them non-recyclable in most facilities."
    },
    sustainable_alternative: {
      name: "Reusable Travel Coffee Mug",
      metrics: [
        "Zero Waste: Stops hundreds of non-recyclable cups and plastic lids from entering the landfill annually.",
        "Better Insulation: Keeps your coffee hot for hours, unlike paper cups that cool quickly.",
        "Coffee Shop Discounts: Many cafes offer a small discount (e.g., $0.10–$0.50) for bringing your own cup.",
        "No Microplastics: Avoids ingesting the microplastic layer that degrades when exposed to hot liquids."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=insulated+travel+coffee+mug"
    }
  },
  {
    day_number: 4,
    conventional_product: {
      name: "Plastic Straws",
      description: "Used for 10 minutes and then discarded. They are too lightweight to be recycled and often end up as marine debris."
    },
    sustainable_alternative: {
      name: "Stainless Steel, Silicone, or Bamboo Straws",
      metrics: [
        "Marine Safe: Eliminates a common source of plastic pollution that harms marine life like sea turtles.",
        "Infinitely Reusable: Metal and silicone straws last for years and are dishwasher safe.",
        "Travel Friendly: Many sets come with a small carrying case and cleaning brush for on-the-go use.",
        "Better for Health: Avoids BPA and other plasticizers found in cheap disposable straws."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=stainless+steel+straws+with+case"
    }
  },
  {
    day_number: 5,
    conventional_product: {
      name: "Liquid Hand Soap in Plastic Pumps",
      description: "Mostly water shipped in heavy plastic bottles with non-recyclable pump mechanisms."
    },
    sustainable_alternative: {
      name: "Solid Bar Soap or Refillable Glass Dispenser",
      metrics: [
        "Plastic Free: Bar soap usually comes in cardboard; refillable systems eliminate constant bottle waste.",
        "Lower Carbon Footprint: Solids are lighter and smaller to ship than heavy, water-filled liquid bottles.",
        "Longer Lasting: A good bar of soap often outlasts 2-3 bottles of liquid soap.",
        "Cleaner Ingredients: Often free from synthetic preservatives needed in liquid formulations."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=natural+bar+soap+sampler"
    }
  },
  {
    day_number: 6,
    conventional_product: {
      name: "Plastic Toothbrush",
      description: "Made of mixed plastics that are unrecyclable. Over 1 billion are thrown away annually in the US alone."
    },
    sustainable_alternative: {
      name: "Bamboo Toothbrush",
      metrics: [
        "Compostable Handle: The bamboo handle is biodegradable and can be composted (remove bristles first).",
        "Renewable Resource: Bamboo is one of the fastest-growing plants on earth and requires little water.",
        "Reduces Ocean Plastic: Prevents hard plastic handles from ending up as marine debris.",
        "Naturally Antimicrobial: Bamboo has natural properties that fight bacteria growth."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=bamboo+toothbrush+multipack"
    }
  },
  {
    day_number: 7,
    conventional_product: {
      name: "Toothpaste Tubes",
      description: "Multi-layer tubes made of plastic and aluminum laminate that are impossible to recycle."
    },
    sustainable_alternative: {
      name: "Toothpaste Tablets in Glass Jar",
      metrics: [
        "Zero Plastic Waste: Tablets come in refillable glass jars or compostable paper pouches.",
        "Waterless Formula: Lighter to ship, reducing transportation carbon emissions.",
        "Travel Friendly: No liquids, so they are TSA-compliant and spill-proof.",
        "Precise Dosage: No messy squeezing or wasted product left in the tube."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=toothpaste+tablets+with+fluoride"
    }
  },
  {
    day_number: 8,
    conventional_product: {
      name: "Disposable Plastic Razors",
      description: "Expensive, short-lived plastic handles and cartridges designed for obsolescence and landfill."
    },
    sustainable_alternative: {
      name: "Stainless Steel Safety Razor",
      metrics: [
        "Lifetime Tool: The metal handle lasts forever; only the single steel blade is replaced.",
        "Massive Savings: Replacement blades cost pennies compared to dollars for plastic cartridges.",
        "Recyclable Blades: Used metal blades can be collected in a tin and recycled as scrap metal.",
        "Better Shave: A single sharp blade reduces irritation and ingrown hairs compared to multi-blade tugging."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=safety+razor+for+beginners"
    }
  },
  {
    day_number: 9,
    conventional_product: {
      name: "Liquid Shampoo & Conditioner Bottles",
      description: "Bulky plastic bottles containing 80% water, contributing to heavy shipping emissions and plastic waste."
    },
    sustainable_alternative: {
      name: "Solid Shampoo & Conditioner Bars",
      metrics: [
        "Eliminates Plastic Bottles: One bar replaces 2-3 bottles of liquid product, saving huge amounts of plastic.",
        "Concentrated & Long-Lasting: Highly concentrated formula lasts much longer than watered-down liquids.",
        "Travel Hero: Compact, lightweight, and no liquid restrictions for flying.",
        "Lower Carbon Footprint: Significantly lighter and smaller to ship."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=shampoo+and+conditioner+bar+set"
    }
  },
  {
    day_number: 10,
    conventional_product: {
      name: "Plastic Synthetic Loofahs/Poufs",
      description: "Made of plastic mesh that sheds microplastics down the drain and breeds bacteria rapidly."
    },
    sustainable_alternative: {
      name: "Natural Loofah Sponge or Wooden Body Brush",
      metrics: [
        "100% Biodegradable: Natural loofahs are dried gourds that can be composted when worn out.",
        "No Microplastics: Does not shed synthetic plastic fibers into the water system.",
        "Better Exfoliation: Provides effective, natural scrubbing without harsh plastic netting.",
        "More Sanitary: Natural materials dry out faster, harboring less bacteria than dense plastic mesh."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=natural+loofah+sponge"
    }
  },
  {
    day_number: 11,
    conventional_product: {
      name: "Disposable Cotton Rounds/Balls",
      description: "Single-use cotton items, often grown with heavy pesticides and packaged in plastic sleeves."
    },
    sustainable_alternative: {
      name: "Reusable Bamboo/Cotton Facial Rounds",
      metrics: [
        "Replaces Thousands: A pack of 10-20 reusable rounds replaces thousands of disposables over a few years.",
        "Washable: Simply toss them in a mesh bag with your regular laundry.",
        "Saves Money: A one-time purchase eliminates a recurring monthly cost.",
        "Softer on Skin: Often made from soft bamboo velour or organic cotton, gentle for sensitive skin."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=reusable+cotton+rounds+with+laundry+bag"
    }
  },
  {
    day_number: 12,
    conventional_product: {
      name: "Conventional Dental Floss",
      description: "Typically made of nylon (plastic) or Teflon, coated in synthetic wax, and packaged in a plastic dispenser."
    },
    sustainable_alternative: {
      name: "Silk or Bamboo Floss in Glass Jar",
      metrics: [
        "Plastic Free Material: Silk or bamboo fiber floss is biodegradable and compostable.",
        "Refillable Container: The glass jar dispenser is reusable; you just buy floss spool refills.",
        "Natural Coatings: Often coated with natural beeswax or plant-based candelilla wax instead of petroleum products.",
        "Toxin Free: Avoids potential PFAS chemicals sometimes found in Glide-style flosses."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=silk+dental+floss+in+glass+jar"
    }
  },
  {
    day_number: 13,
    conventional_product: {
      name: "Paper Towels",
      description: "Single-use paper products derived from trees, bleached with chemicals, and wrapped in plastic film."
    },
    sustainable_alternative: {
      name: "Swedish Dishcloths or Cotton Rags",
      metrics: [
        "Super Absorbent: One Swedish dishcloth absorbs 20x its weight and replaces roughly 17 rolls of paper towels.",
        "Reusable & Washable: Can be washed in the dishwasher or washing machine up to 200 times.",
        "Saves Trees & Money: Drastically reduces demand for virgin wood pulp and eliminates a recurring grocery cost.",
        "Compostable: Made from cellulose and cotton, they are 100% biodegradable at the end of their life."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=swedish+dishcloths+cellulose+sponge+cloths"
    }
  },
  {
    day_number: 14,
    conventional_product: {
      name: "Plastic Cling Wrap",
      description: "Thin, difficult-to-handle plastic film made from PVC or LDPE, used once and thrown away."
    },
    sustainable_alternative: {
      name: "Beeswax Food Wraps",
      metrics: [
        "Reusable for a Year: Washable with cool water and mild soap, lasting for about a year of regular use.",
        "Natural & Breathable: Made from cotton, beeswax, jojoba oil, and tree resin; allows food to breathe, keeping it fresher.",
        "Compostable: At the end of its life, it can be cut up and composted or used as a natural fire starter.",
        "Replaces Aluminum Foil too: Can be used to cover bowls, wrap sandwiches, cheese, and produce."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=beeswax+food+wraps+variety+pack"
    }
  },
  {
    day_number: 15,
    conventional_product: {
      name: "Disposable Plastic Sandwich/Freezer Bags",
      description: "Single-use polyethylene bags that are rarely recycled and often end up in waterways."
    },
    sustainable_alternative: {
      name: "Reusable Silicone Food Storage Bags (e.g., Stasher)",
      metrics: [
        "Infinitely Reusable: High-quality platinum silicone lasts for thousands of uses, replacing endless boxes of plastic bags.",
        "Durable & Versatile: Safe for the freezer, microwave, dishwasher, and even boiling water (sous vide).",
        "Airtight Seal: Keeps food fresher longer with a reliable, pinch-press seal.",
        "Plastic Free/BPA Free: Made from silica (sand), a safer alternative to petroleum-based plastics."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=reusable+silicone+food+storage+bags"
    }
  },
  {
    day_number: 16,
    conventional_product: {
      name: "Plastic Produce Bags",
      description: "Thin, flimsy plastic bags found in the grocery produce aisle that are difficult to recycle and easily become litter."
    },
    sustainable_alternative: {
      name: "Reusable Mesh or Cotton Produce Bags",
      metrics: [
        "Breathable Storage: Mesh allows air to circulate, keeping fruits and veggies fresher longer than suffocating plastic.",
        "Durable & Washable: Strong enough for heavy items like potatoes and easy to toss in the laundry.",
        "Replaces Thousands: A small set eliminates the need for hundreds of disposable bags per year.",
        "Scannable: Checkout scanners can usually read barcodes right through the mesh fabric."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=reusable+mesh+produce+bags+organic+cotton"
    }
  },
  {
    day_number: 17,
    conventional_product: {
      name: "Conventional Synthetic Sponges",
      description: "Made from foamed plastic polymers that shed microplastics with every use and are non-biodegradable."
    },
    sustainable_alternative: {
      name: "Cellulose Sponges & Coconut Scourers",
      metrics: [
        "Plant-Based Materials: Made from wood pulp (cellulose) and coconut husk fibers, which are renewable resources.",
        "100% Compostable: When they get ratty, you can bury them in the garden instead of trashing them.",
        "No Microplastics: Does not shed permanent plastic particles into the water system.",
        "Effective Cleaning: Cellulose is highly absorbent, and coconut fiber provides excellent, non-scratch scrubbing power."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=biodegradable+cellulose+sponge+coconut+scourer"
    }
  },
  {
    day_number: 18,
    conventional_product: {
      name: "Plastic Coffee Pods (e.g., K-Cups)",
      description: "Single-serving plastic and foil cups that are technically recyclable but rarely are due to size and food contamination."
    },
    sustainable_alternative: {
      name: "Reusable Stainless Steel Filter Pod or French Press",
      metrics: [
        "Massive Waste Reduction: Stops hundreds or thousands of plastic pods from entering landfills annually per household.",
        "Significant Savings: Buying bagged coffee is 50-80% cheaper per cup than buying pre-packaged pods.",
        "Better Coffee: Allows you to use fresh-ground, higher-quality beans for a superior brew.",
        "PFAS/Plastic Free: Avoids brewing hot water inside a plastic container."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=reusable+k+cup+stainless+steel"
    }
  },
  {
    day_number: 19,
    conventional_product: {
      name: "Liquid Laundry Detergent Jugs",
      description: "Heavy, bulky plastic jugs that are mostly water, requiring massive fossil fuels to ship."
    },
    sustainable_alternative: {
      name: "Laundry Detergent Sheets/Strips",
      metrics: [
        "Zero Plastic Jugs: Packaging is a simple, recyclable cardboard envelope.",
        "Low Carbon Footprint: Weighs ~94% less than liquid detergent, drastically reducing shipping emissions.",
        "No Mess/Measuring: Pre-measured strips dissolve instantly; no sticky cups or heavy pouring.",
        "Space Saving: A year's supply fits easily in a small drawer."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=laundry+detergent+sheets+eco+friendly"
    }
  },
  {
    day_number: 20,
    conventional_product: {
      name: "Dryer Sheets",
      description: "Single-use polyester (plastic) sheets coated in synthetic fragrances and softeners that coat fabrics and dryer vents."
    },
    sustainable_alternative: {
      name: "Wool Dryer Balls",
      metrics: [
        "Reusable 1,000+ Loads: A set lasts for years, replacing dozens of boxes of disposable sheets.",
        "Saves Energy: By bouncing around and separating clothes, they reduce drying time by 10–25%.",
        "Chemical Free Softening: Softens fabrics through mechanical action rather than chemical coatings.",
        "Toxin Free: No synthetic fragrances or skin irritants left on your clothes or bedding."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=organic+wool+dryer+balls"
    }
  },
  {
    day_number: 21,
    conventional_product: {
      name: "Plastic Cleaning Bottles",
      description: "Buying new plastic spray bottles filled with mostly water every time you need more cleaner."
    },
    sustainable_alternative: {
      name: "Glass Spray Bottle + Concentrated Refills",
      metrics: [
        "Stop Shipping Water: Buy small tablets or concentrate tubes and add your own tap water at home.",
        "Reusable Bottle: High-quality glass bottles and durable silicone sleeves last indefinitely.",
        "Massive Plastic Reduction: Eliminates the need to buy a new plastic trigger sprayer bottle every month.",
        "Saves Money & Space: Concentrates are cheaper and take up far less storage space than full bottles."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=glass+spray+bottle+cleaning+concentrate"
    }
  },
  {
    day_number: 22,
    conventional_product: {
      name: "Disposable Plastic Cutlery",
      description: "Flimsy plastic forks, spoons, and knives used for takeout or parties that break easily and are not recyclable."
    },
    sustainable_alternative: {
      name: "Reusable Travel Cutlery Set (Bamboo or Steel)",
      metrics: [
        "Always Prepared: A compact set in your bag means you never need single-use plastic for takeout lunches.",
        "Durable & Functional: Actually works for eating, unlike flimsy plastic forks that snap.",
        "Zero Waste: Keeps hundreds of plastic utensils out of landfills over time.",
        "Hygienic: Comes in a washable carrying case, keeping them clean in your bag."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=reusable+travel+cutlery+set+with+case"
    }
  },
  {
    day_number: 23,
    conventional_product: {
      name: "Aerosol Cooking Spray",
      description: "Metal cans containing propellants (like butane or propane) alongside the oil, which cannot be easily refilled."
    },
    sustainable_alternative: {
      name: "Reusable Oil Mistry/Sprayer Bottle",
      metrics: [
        "Propellant Free: Uses simple air pressure pumping to spray oil, no chemical propellants needed.",
        "Refillable: Buy your preferred high-quality oil in bulk and refill the sprayer indefinitely.",
        "Eliminates Cans: Stops the continuous cycle of buying and discarding aerosol metal cans.",
        "Healthier/Cheaper: You control the quality of the oil, and bulk oil is cheaper than spray cans."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=olive+oil+sprayer+mister+for+cooking"
    }
  },
  {
    day_number: 24,
    conventional_product: {
      name: "Plastic Deodorant Containers",
      description: "Twist-up plastic tubes that are composed of mixed plastics and are rarely recyclable."
    },
    sustainable_alternative: {
      name: "Deodorant in Cardboard Tube or Glass Jar",
      metrics: [
        "Plastic Free Packaging: Tubes are made of 100% compostable paperboard; jars are recyclable/reusable glass.",
        "Natural Ingredients: Often free from aluminum, parabens, and synthetic fragrances found in conventional brands.",
        "Zero Waste: The entire paper tube can be composted at home when empty.",
        "Effective Formulas: Modern natural deodorants use effective ingredients like magnesium and arrowroot powder."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=plastic+free+natural+deodorant+cardboard+tube"
    }
  },
  {
    day_number: 25,
    conventional_product: {
      name: "Plastic Cotton Swabs (Q-tips)",
      description: "Cotton swabs with a plastic stick that are often flushed down toilets, bypassing filters and ending up in oceans."
    },
    sustainable_alternative: {
      name: "Bamboo or Paper Stem Cotton Swabs",
      metrics: [
        "100% Biodegradable: Both the cotton tip and the bamboo/paper stem are compostable.",
        "Marine Safe: If they accidentally end up in waterways, they will break down rather than harming marine life.",
        "Renewable Materials: Bamboo grows rapidly without pesticides, making it a sustainable alternative to plastic.",
        "Sturdy: Bamboo stems are often stronger and less bendy than flimsy plastic ones."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=bamboo+cotton+swabs+biodegradable"
    }
  },
  {
    day_number: 26,
    conventional_product: {
      name: "Conventional Tea Bags",
      description: "Standard 'paper' tea bags that are often actually sealed with polypropylene plastic, which doesn't compost."
    },
    sustainable_alternative: {
      name: "Loose Leaf Tea & Stainless Steel Infuser",
      metrics: [
        "Zero Microplastics: Avoids the billions of microplastic particles released into hot water by plastic-sealed bags.",
        "100% Compostable: Used tea leaves go straight to the soil with no non-biodegradable mesh or staples left behind.",
        "Better Flavor/Less Waste: Whole leaves offer superior taste and require significantly less cardboard packaging per serving than boxed bags.",
        "Reusable Tool: A high-quality stainless steel infuser lasts a lifetime, replacing thousands of disposable bags."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=stainless+steel+tea+infuser+ball"
    }
  },
  {
    day_number: 27,
    conventional_product: {
      name: "Plastic Hair Comb",
      description: "Cheaply molded plastic combs that generate static electricity and often have sharp manufacturing seams."
    },
    sustainable_alternative: {
      name: "Wooden or Bamboo Comb (e.g., Neem Wood)",
      metrics: [
        "Zero Static & Frizz: Wood is an electrical insulator and does not generate static electricity like plastic does.",
        "Healthier Hair: Wooden teeth are smooth and seamless, preventing the snagging and hair breakage caused by cheap plastic seams.",
        "Natural Conditioning: Porous wood absorbs the scalp's natural oils and redistributes them down the hair shaft to condition dry ends.",
        "Biodegradable: Made from renewable resources and is 100% compostable at the end of its life."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=neem+wood+comb+wide+tooth"
    }
  },
  {
    day_number: 28,
    conventional_product: {
      name: "Disposable Car Air Freshener",
      description: "Cardboard trees or plastic vent clips soaked in strong synthetic fragrances that off-gas quickly."
    },
    sustainable_alternative: {
      name: "Reusable Wood/Felt Diffuser Clip + Essential Oils",
      metrics: [
        "Toxin Free Air: Avoids inhaling synthetic Volatile Organic Compounds (VOCs), phthalates, and formaldehyde in the enclosed car space.",
        "Infinitely Refillable: No more throwing away dried-out fresheners every month; just add 2-3 drops of essential oil whenever needed.",
        "Zero Waste Hardware: The wood or metal diffuser clip lasts forever, and essential oil glass bottles are highly recyclable.",
        "Customizable Scent: You control the ingredients and intensity using natural oils (e.g., peppermint, lavender)."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=car+essential+oil+diffuser+vent+clip"
    }
  },
  {
    day_number: 29,
    conventional_product: {
      name: "Teflon/Non-Stick Coated Pan",
      description: "Aluminum pans coated in PTFE (plastic) that easily scratches, flakes into food, and degrades over time."
    },
    sustainable_alternative: {
      name: "Cast Iron Skillet",
      metrics: [
        "PFAS Free Cooking: Eliminates exposure to toxic fumes and 'forever chemicals' released when traditional non-stick coatings overheat or scratch.",
        "Buy It For Life (BIFL): Virtually indestructible and lasts for generations, replacing dozens of disposable coated pans over a lifetime.",
        "Natural Non-Stick: A well-seasoned cast iron pan provides a slick, natural cooking surface without synthetic chemicals.",
        "Healthier Food: Adds a small, beneficial amount of dietary iron to your food instead of microplastics."
      ],
      purchase_link_query: "https://www.amazon.com/s?k=lodge+cast+iron+skillet+10.25"
    }
  },
  {
    day_number: 30,
    conventional_product: {
      name: "The \"Disposable\" Consumer Mindset",
      description: "The cycle of buying fast based on trends, using items briefly, and trashing them quickly when they break or go out of style."
    },
    sustainable_alternative: {
      name: "The \"Sustainable\" Steward Mindset",
      metrics: [
        "Buy Less, Choose Better: Prioritizing quality, durability, and actual necessity over impulse buys and cheap trends.",
        "Care & Repair: Seeing value in maintaining, mending, and extending the life of what you already own.",
        "Financial Freedom: Significant savings by stepping off the hedonic treadmill of constant replacement.",
        "Curated Living: Shifting from a cluttered home and overflowing landfills to a thoughtful, intentional, lower-waste existence."
      ],
      purchase_link_query: ""
    }
  }
];

type DoorState = "closed" | "open" | "revealed";

export default function TrustEarthy() {
  const [doorStates, setDoorStates] = useState<Record<number, DoorState>>({});
  const [selectedDay, setSelectedDay] = useState<SwapData | null>(null);

  const handleDoorClick = (day: number) => {
    const currentState = doorStates[day] || "closed";
    
    if (currentState === "closed") {
      setDoorStates(prev => ({ ...prev, [day]: "open" }));
    } else if (currentState === "open") {
      const swap = swapData.find(s => s.day_number === day);
      if (swap) {
        setSelectedDay(swap);
      }
    }
  };

  const closeDoor = (day: number) => {
    setDoorStates(prev => ({ ...prev, [day]: "closed" }));
  };

  // Group doors into rows of 6 for the shelf effect
  const rows = [];
  for (let i = 0; i < 30; i += 6) {
    rows.push(swapData.slice(i, i + 6));
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="section-container text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-eco-green/10 mb-4">
            <Leaf className="h-7 w-7 text-eco-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            30-Day Sustainable Swap Challenge
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Open a door each day to discover a simple swap that reduces waste and saves money.
            Small changes, real impact.
          </p>
        </div>
      </section>

      {/* Demo Carousel */}
      <DemoCarousel 
        slides={demoSlides}
        title="How TrustEarthy Works"
        subtitle="Discover how small sustainable swaps can create big environmental impact—one day at a time."
      />

      {/* Closet Shelves */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-wood-dark/20 rounded-2xl p-6 sm:p-8 border border-wood/30">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-2 last:mb-0">
                {/* Shelf row */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-2">
                  {row.map((swap) => {
                    const state = doorStates[swap.day_number] || "closed";
                    
                    return (
                      <div
                        key={swap.day_number}
                        onClick={() => handleDoorClick(swap.day_number)}
                        className={`
                          relative aspect-square rounded-lg cursor-pointer overflow-hidden
                          ${state === "closed" ? "closet-door" : "closet-door-open"}
                        `}
                      >
                        {state === "closed" ? (
                          // Closed door with day number
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold text-primary-foreground/90 drop-shadow-lg">
                              {swap.day_number}
                            </span>
                            {/* Door handle */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-wood-dark/50 rounded-full" />
                          </div>
                        ) : (
                          // Open door showing conventional product
                          <div className="absolute inset-0 p-2 sm:p-3 flex flex-col items-center justify-center text-center">
                            <p className="text-[10px] sm:text-xs font-medium text-foreground leading-tight line-clamp-3">
                              {swap.conventional_product.name}
                            </p>
                            <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-1">
                              Tap to swap
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Shelf */}
                <div className="closet-shelf h-2 rounded-sm" />
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Click a door to open it, then click the revealed item to see the sustainable swap.
          </p>
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
          {selectedDay && (
            <div className="relative">
              {/* Header with day badge */}
              <div className="bg-gradient-to-br from-eco-green to-eco-green/80 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <span className="text-3xl font-bold">{selectedDay.day_number}</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Day</p>
                    <p className="text-xl font-bold">Sustainable Swap</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 space-y-5">
                {/* VS Comparison */}
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* Conventional - Left side */}
                  <div className="bg-muted/60 rounded-xl p-4 border border-border/50 relative">
                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wide rounded-full">
                      ✕ Avoid
                    </div>
                    <div className="mt-2 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                        <X className="h-6 w-6 text-destructive" />
                      </div>
                      <p className="font-semibold text-foreground text-sm leading-tight">
                        {selectedDay.conventional_product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {selectedDay.conventional_product.description}
                      </p>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-10 h-10 rounded-full bg-card border-2 border-eco-green shadow-lg flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-eco-green" />
                    </div>
                  </div>

                  {/* Sustainable - Right side */}
                  <div className="bg-eco-green/5 rounded-xl p-4 border-2 border-eco-green/30 relative">
                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-eco-green text-white text-xs font-semibold uppercase tracking-wide rounded-full">
                      ✓ Choose
                    </div>
                    <div className="mt-2 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-eco-green/20 flex items-center justify-center mb-3">
                        <Leaf className="h-6 w-6 text-eco-green" />
                      </div>
                      <p className="font-semibold text-foreground text-sm leading-tight">
                        {selectedDay.sustainable_alternative.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-eco-green/5 to-transparent rounded-xl p-4 border border-eco-green/20">
                  <p className="text-xs uppercase tracking-wider text-eco-green font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Why it's better
                  </p>
                  <div className="space-y-2">
                    {selectedDay.sustainable_alternative.metrics.slice(0, 3).map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-eco-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-eco-green" />
                        </div>
                        <span className="text-sm text-foreground/80">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Link */}
                {selectedDay.sustainable_alternative.purchase_link_query && (
                  <Button asChild className="w-full h-12 bg-eco-green hover:bg-eco-green/90 text-base font-semibold shadow-lg shadow-eco-green/20">
                    <a 
                      href={selectedDay.sustainable_alternative.purchase_link_query}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Shop Sustainable Option
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}