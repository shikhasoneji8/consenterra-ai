import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PitchData {
  raw_pitch_text: string;
  startup_name?: string;
  stage?: string;
  arr?: number;
  mrr?: number;
  ask_amount: number;
  equity_percent: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pitch } = await req.json() as { pitch: PitchData };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating investor panel for pitch:", pitch);

    const systemPrompt = `You are an AI that generates investor personas for a Shark Tank-style funding panel.

Given a founder's pitch, generate 3-5 investor personas. Each persona should have:
- name: A realistic investor name
- role: One of "Angel Investor", "Venture Capitalist", "Shark", "CEO-Operator", "Strategic Investor"
- thesis: A one-liner investment thesis (what they typically invest in)
- risk_appetite: "Low", "Medium", or "High"
- questions: Array of 1-2 sharp, fundraising-relevant questions (about traction, GTM, moat, churn, CAC, competition)
- risk_note: 1-2 sentences about their risk assessment
- offer_amount: Number representing their investment offer (can be 0 if they pass)
- offer_rationale: 1-2 sentences explaining their offer decision

The total of all offer_amounts should aim to cover the ask_amount, but some investors may pass (offer 0).

Respond ONLY with a valid JSON object with this structure:
{
  "personas": [
    {
      "name": "string",
      "role": "string", 
      "thesis": "string",
      "risk_appetite": "Low" | "Medium" | "High",
      "questions": ["string", "string"],
      "risk_note": "string",
      "offer_amount": number,
      "offer_rationale": "string"
    }
  ]
}`;

    const userPrompt = `Generate an investor panel for this pitch:

Pitch: "${pitch.raw_pitch_text}"
${pitch.startup_name ? `Startup Name: ${pitch.startup_name}` : ''}
${pitch.stage ? `Stage: ${pitch.stage}` : ''}
${pitch.arr ? `ARR: $${pitch.arr.toLocaleString()}` : ''}
${pitch.mrr ? `MRR: $${pitch.mrr.toLocaleString()}` : ''}
Ask Amount: $${pitch.ask_amount.toLocaleString()}
Equity Offered: ${pitch.equity_percent}%`;

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
    let personas;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        personas = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse investor panel data");
    }

    return new Response(JSON.stringify(personas), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating investor panel:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
