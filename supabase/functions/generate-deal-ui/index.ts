import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Persona {
  name: string;
  role: string;
  thesis: string;
  risk_appetite: string;
  questions: string[];
  risk_note: string;
  offer_amount: number;
  offer_rationale: string;
}

interface DealRequest {
  pitch: {
    startup_name?: string;
    ask_amount: number;
    equity_percent: number;
    raw_pitch_text: string;
  };
  personas: Persona[];
  answers?: Record<string, string[]>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pitch, personas, answers } = await req.json() as DealRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating deal UI for:", { pitch, personas: personas.length });

    // Filter participating investors (those with offers > 0)
    const participatingInvestors = personas.filter(p => p.offer_amount > 0);
    const totalOffered = participatingInvestors.reduce((sum, p) => sum + p.offer_amount, 0);
    
    // Calculate post-money valuation
    const postMoneyValuation = pitch.ask_amount / (pitch.equity_percent / 100);
    
    // Calculate equity allocation per investor
    const allocations = participatingInvestors.map(investor => ({
      name: investor.name,
      role: investor.role,
      amount: investor.offer_amount,
      equity_percent: pitch.equity_percent * (investor.offer_amount / pitch.ask_amount),
      rationale: investor.offer_rationale,
    }));

    const systemPrompt = `You are an AI that generates a creative deal summary for a Shark Tank-style funding round.

Given the pitch details and investor allocations, generate a compelling deal summary with:
- headline: A punchy headline for the deal (e.g., "Deal of the Day: AI Invoicing Raises $100K")
- tagline: A one-liner tagline for the deal
- deal_highlights: Array of 3-4 short highlights about what makes this deal interesting
- risk_summary: Brief overall risk assessment
- success_prediction: A fun prediction about the startup's future (1-2 sentences)
- deal_grade: A letter grade A-F for the overall deal quality

Respond ONLY with a valid JSON object.`;

    const userPrompt = `Generate a deal summary for:

Startup: ${pitch.startup_name || 'Unnamed Startup'}
Pitch: "${pitch.raw_pitch_text}"
Ask: $${pitch.ask_amount.toLocaleString()} for ${pitch.equity_percent}%
Post-Money Valuation: $${postMoneyValuation.toLocaleString()}

Participating Investors:
${allocations.map(a => `- ${a.name} (${a.role}): $${a.amount.toLocaleString()} for ${a.equity_percent.toFixed(2)}%`).join('\n')}

Total Raised: $${totalOffered.toLocaleString()} (${((totalOffered / pitch.ask_amount) * 100).toFixed(0)}% of ask)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", content);

    // Parse the JSON from the response
    let summary;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Provide fallback summary
      summary = {
        headline: `${pitch.startup_name || 'Startup'} Secures $${totalOffered.toLocaleString()} Funding`,
        tagline: "A new chapter begins",
        deal_highlights: ["Competitive terms", "Strong investor lineup", "Growth potential"],
        risk_summary: "Moderate risk with strong upside potential",
        success_prediction: "This startup shows promise for significant growth.",
        deal_grade: "B+",
      };
    }

    const dealTerms = {
      ...summary,
      ask_amount: pitch.ask_amount,
      equity_percent: pitch.equity_percent,
      total_raised: totalOffered,
      post_money_valuation: postMoneyValuation,
      funding_percentage: (totalOffered / pitch.ask_amount) * 100,
      allocations,
      is_fully_funded: totalOffered >= pitch.ask_amount,
    };

    return new Response(JSON.stringify({ deal_terms: dealTerms }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating deal UI:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
