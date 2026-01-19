import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS / preflight (safe default; adjust origin if you want to lock it down)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Missing RESEND_API_KEY" });
    }

    // Vercel may give body as object already; handle string just in case
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body ?? {});

    const {
      fullName,
      email,
      phone,
      role,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    } = body as {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      resumeUrl?: string;
      coverLetter?: string;
    };

    // Required fields
    if (!fullName || !email || !role) {
      return res.status(400).json({ error: "Missing required fields: fullName, email, role" });
    }

    // Light validation (avoid obvious garbage)
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return res.status(400).json({ error: "Invalid email address" });

    const to = ["shikha@consenterra.ai", "sameer@consenterra.ai"];
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "ConsenTerra Careers <careers@consenterra.ai>";

    const subject = `New Application: ${role} — ${fullName}`;

    const safe = {
      fullName: escapeHtml(fullName),
      email: escapeHtml(email),
      phone: escapeHtml(phone || "-"),
      role: escapeHtml(role),
      linkedinUrl: escapeHtml(linkedinUrl || "-"),
      portfolioUrl: escapeHtml(portfolioUrl || "-"),
      resumeUrl: escapeHtml(resumeUrl || "-"),
      coverLetter: escapeHtml(coverLetter || "-").replace(/\n/g, "<br/>"),
    };

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.4;">
        <h2 style="margin:0 0 12px;">New Job Application</h2>
        <p style="margin:6px 0;"><b>Name:</b> ${safe.fullName}</p>
        <p style="margin:6px 0;"><b>Email:</b> ${safe.email}</p>
        <p style="margin:6px 0;"><b>Phone:</b> ${safe.phone}</p>
        <p style="margin:6px 0;"><b>Role:</b> ${safe.role}</p>
        <p style="margin:6px 0;"><b>LinkedIn:</b> ${safe.linkedinUrl}</p>
        <p style="margin:6px 0;"><b>Portfolio/GitHub:</b> ${safe.portfolioUrl}</p>
        <p style="margin:6px 0;"><b>Resume URL:</b> ${safe.resumeUrl}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:14px 0;" />
        <p style="margin:6px 0;"><b>Why ConsenTerra:</b><br/>${safe.coverLetter}</p>
      </div>
    `;

    const result = await resend.emails.send({ from, to, subject, html });

    // Resend returns { data, error } in many SDK versions; handle both safely
    // @ts-ignore
    if (result?.error) {
      // @ts-ignore
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}