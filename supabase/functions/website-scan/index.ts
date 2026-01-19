import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cover_letter?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const application: ApplicationNotificationRequest = await req.json();
    console.log("Received application notification request:", application);

    const { full_name, email, phone, role, linkedin_url, portfolio_url, cover_letter } = application;

    const emailHtml = `
      <h1>New Job Application Received</h1>
      <h2>Applicant Details</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${full_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Applied For</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${role}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">LinkedIn</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${linkedin_url ? `<a href="${linkedin_url}">${linkedin_url}</a>` : 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Portfolio</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${portfolio_url ? `<a href="${portfolio_url}">${portfolio_url}</a>` : 'Not provided'}</td>
        </tr>
      </table>
      ${cover_letter ? `
        <h3>Cover Letter</h3>
        <div style="padding: 16px; background-color: #f5f5f5; border-radius: 8px; white-space: pre-wrap;">${cover_letter}</div>
      ` : ''}
      <p style="margin-top: 24px; color: #666;">This is an automated notification from ConsenTerra Careers.</p>
    `;

    // Send to both recipients
    const recipients = ["shikha@consenterra.ai", "sameer@consenterra.ai"];
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ConsenTerra Careers <careers@consenterra.ai>",
        to: recipients,
        subject: `New Application: ${role} - ${full_name}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully to:", recipients, emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-application-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
