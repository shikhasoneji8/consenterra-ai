// supabase/functions/send-application-notification/index.ts
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.consenterra.ai",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      role,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    } = body ?? {};

    if (!fullName || !email || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendKey);

    const to = ["shikha@consenterra.ai", "sameer@consenterra.ai"];
    const from = Deno.env.get("RESEND_FROM_EMAIL") || "ConsenTerra Careers <careers@consenterra.ai>";
    const subject = `New Application: ${role} — ${fullName}`;

    const html = `
      <h2>New Job Application</h2>
      <p><b>Name:</b> ${fullName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Role:</b> ${role}</p>
      <p><b>LinkedIn:</b> ${linkedinUrl || "-"}</p>
      <p><b>Portfolio/GitHub:</b> ${portfolioUrl || "-"}</p>
      <p><b>Resume:</b> ${resumeUrl || "-"}</p>
      <p><b>Why ConsenTerra:</b><br/>${String(coverLetter || "-").replace(/\n/g, "<br/>")}</p>
    `;

    const result = await resend.emails.send({ from, to, subject, html });
    // @ts-ignore
    if (result?.error) throw result.error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});