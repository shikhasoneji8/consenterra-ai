import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_GUEST_USES = 2;

// Validate guest usage token
const validateGuestToken = (token: string | undefined): { valid: boolean; count: number } => {
  if (!token) {
    return { valid: true, count: 0 }; // No token means first-time or authenticated user
  }
  
  try {
    const decoded = JSON.parse(atob(token));
    const count = decoded.count || 0;
    
    // Check if usage count is within limit
    if (count >= MAX_GUEST_USES) {
      return { valid: false, count };
    }
    
    return { valid: true, count };
  } catch {
    // Invalid token format - allow but treat as 0 uses
    return { valid: true, count: 0 };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { url, guest_token, persona = 'everyday', is_persona_rescan = false, dev_bypass = false } = body;
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if this is an authenticated request
    const authHeader = req.headers.get("authorization");
    let isAuthenticated = false;
    
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } },
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      isAuthenticated = !!user;
    }

    // For unauthenticated users, validate guest token
    // Skip limit check for: dev bypass, persona rescans, or authenticated users
    if (!isAuthenticated && !is_persona_rescan && !dev_bypass) {
      const { valid, count } = validateGuestToken(guest_token);
      
      if (!valid) {
        console.log(`Guest limit exceeded. Count: ${count}`);
        return new Response(
          JSON.stringify({ 
            error: "guest_limit_exceeded",
            message: "You've used your 2 free analyses. Please sign up to continue."
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    if (dev_bypass) {
      console.log("Dev bypass enabled - skipping guest limits");
    }

    // Normalize the URL/domain
    let domain = url.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Persona-specific language adjustments
    const personaInstructions = {
      everyday: `
Language style: Simple, friendly, non-technical
- Use everyday analogies (e.g., "like leaving your front door unlocked")
- Avoid jargon completely
- Focus on practical impacts ("what this means for you")
- Keep explanations brief and actionable
- Use reassuring tone for low risks, clear warnings for high risks`,
      privacy: `
Language style: Technical, detailed, comprehensive
- Include technical details (cookie types, tracking methods, data retention periods)
- Reference specific regulations (GDPR, CCPA, ePrivacy)
- Explain the "how" and "why" behind each finding
- Include privacy-enhancing recommendations (browser extensions, settings)
- Be thorough about potential data flows and third-party sharing`,
      business: `
Language style: Professional, compliance-focused, risk-oriented
- Frame findings in terms of business/legal liability
- Reference regulatory frameworks and potential penalties
- Highlight competitive positioning implications
- Focus on compliance gaps and remediation priorities
- Include considerations for customer trust and reputation`
    };

    const personaContext = personaInstructions[persona as keyof typeof personaInstructions] || personaInstructions.everyday;

    const systemPrompt = `You are a privacy and security analyst for websites. Given a website domain, analyze typical privacy practices for that type of site and provide a comprehensive risk assessment.

${personaContext}

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
- Adapt language and detail level based on the persona instructions above
- Be non-legal, but match technical depth to persona
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
