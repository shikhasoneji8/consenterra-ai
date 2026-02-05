import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  wantsMeeting: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, wantsMeeting }: ContactFormData = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ConsenTerra Contact <noreply@consenterra.ai>",
        to: ["shikha@consenterra.ai", "sameer@consenterra.ai"],
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #e5e7eb;" />
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Interested in meeting:</strong> ${wantsMeeting ? "Yes" : "No"}</p>
            
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #7c3aed;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            
            <hr style="border: 1px solid #e5e7eb; margin-top: 24px;" />
            <p style="color: #6b7280; font-size: 12px;">
              This email was sent from the ConsenTerra contact form.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email");
    }

    const data = await response.json();

    // Also send a confirmation email to the user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ConsenTerra <noreply@consenterra.ai>",
        to: [email],
        subject: "We received your message - ConsenTerra",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Thank you for reaching out, ${name}!</h2>
            
            <p>We've received your message and truly appreciate you taking the time to contact us.</p>
            
            <p>Someone from the ConsenTerra team will be in touch soon${wantsMeeting ? " to schedule a meeting" : ""}.</p>
            
            <p>In the meantime, feel free to explore our privacy tools at <a href="https://consenterra.ai">consenterra.ai</a>.</p>
            
            <p style="margin-top: 24px;">
              Best regards,<br/>
              <strong>The ConsenTerra Team</strong>
            </p>
            
            <hr style="border: 1px solid #e5e7eb; margin-top: 24px;" />
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated confirmation. Please do not reply to this email.
            </p>
          </div>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});