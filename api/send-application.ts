import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const {
      fullName,
      email,
      phone,
      role,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    } = req.body || {};

    if (!fullName || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const to = ["shikha@consenterra.ai", "sameer@consenterra.ai"];
    const from = process.env.RESEND_FROM_EMAIL || "ConsenTerra Careers <careers@consenterra.ai>";

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
      <p><b>Why ConsenTerra:</b><br/>${(coverLetter || "-").replace(/\n/g, "<br/>")}</p>
    `;

    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) return res.status(500).json({ error });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}