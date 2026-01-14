// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize the URL/domain
    let domain = url.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a privacy and security analyst for websites. Given a website domain, analyze typical privacy practices for that type of site and provide a comprehensive risk assessment.

You MUST return a valid JSON object with this exact structure:
{
  "domain": "the domain being analyzed",
  "score": number from 0-100 (100 = most trustworthy),
  "risk_level": "Low" | "Medium" | "High",
  "summary": "1-2 sentence plain-language summary of the site's privacy stance",
  "immediate_risks": [
    {"severity": "green" | "yellow" | "red", "text": "risk description"}
  ],
  "dark_patterns": {
    "detected": boolean,
    "items": [{"type": "pattern name", "evidence": "where/how it appears"}]
  },
  "digital_footprint": {
    "chips": ["Tracking/Analytics", "Third-party sharing indicators", "Ads/retargeting indicators", "Account data", "Location", "Device identifiers"],
    "details": [{"label": "category", "text": "explanation"}],
    "note": "AI inference disclaimer"
  },
  "actions": [
    {"title": "action title", "text": "brief instruction"}
  ],
  "confidence": "Low" | "Medium" | "High"
}

Guidelines:
- Be non-legal, use plain English
- Avoid scary language unless risk is truly high
- Clearly label uncertainty and inference
- Provide 3-6 immediate risks
- Provide 3-5 actionable steps
- Keep output concise and helpful
- Base analysis on known practices of the domain type (social media, e-commerce, news, etc.)`;

    const userPrompt = `Analyze the privacy and security practices of this website: ${domain}

Consider:
1. What type of site is this? (social media, e-commerce, news, search engine, etc.)
2. What data do sites like this typically collect?
3. Are there known privacy concerns with this specific site or type of site?
4. What tracking technologies are commonly used?
5. Are there any known dark patterns?
6. What should users be aware of?

Return only the JSON object, no markdown or explanation.`;

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    let scanResult;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      scanResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse scan results");
    }

    // Ensure domain is set correctly
    scanResult.domain = domain;

    return new Response(
      JSON.stringify(scanResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Website scan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Scan failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
