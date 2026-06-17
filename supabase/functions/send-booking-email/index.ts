import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingPayload {
  name: string;
  email: string;
  organization: string;
  industry: string;
  topic: string;
  bookingDate: string;
  bookingTime: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: BookingPayload = await req.json();
    const { name, email, organization, industry, topic, bookingDate, bookingTime } = payload;

    const notificationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border: 1px solid #1e1e1e;">
        <div style="padding: 24px 32px; border-bottom: 1px solid #1e1e1e;">
          <h1 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
            AMTECH<span style="color: #E11D2A;">.</span> New Demo Booking
          </h1>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; vertical-align: top; width: 140px;">Name</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px;"><a href="mailto:${email}" style="color: #E11D2A;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; vertical-align: top;">Organization</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px;">${organization || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; vertical-align: top;">Industry</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px;">${industry}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; vertical-align: top;">Topic</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px;">${topic}</td>
            </tr>
            <tr style="border-top: 1px solid #1e1e1e;">
              <td style="padding: 16px 0 12px; color: #E11D2A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; vertical-align: top;">Date</td>
              <td style="padding: 16px 0 12px; color: #fff; font-size: 14px; font-weight: 600;">${bookingDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #E11D2A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; vertical-align: top;">Time</td>
              <td style="padding: 12px 0; color: #fff; font-size: 14px; font-weight: 600;">${bookingTime}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #1e1e1e; text-align: center;">
          <p style="margin: 0; color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">American Marketing Technology</p>
        </div>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border: 1px solid #1e1e1e;">
        <div style="padding: 24px 32px; border-bottom: 1px solid #1e1e1e;">
          <h1 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
            AMTECH<span style="color: #E11D2A;">.</span> Demo Confirmed
          </h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name}, your demo has been scheduled. We look forward to speaking with you.
          </p>
          <div style="background: #111; border: 1px solid #1e1e1e; padding: 20px;">
            <p style="margin: 0 0 8px; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em;">Scheduled For</p>
            <p style="margin: 0 0 4px; color: #fff; font-size: 16px; font-weight: 600;">${bookingDate}</p>
            <p style="margin: 0 0 16px; color: #E11D2A; font-size: 14px; font-weight: 600;">${bookingTime}</p>
            <p style="margin: 0 0 4px; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em;">Topic</p>
            <p style="margin: 0; color: #fff; font-size: 14px;">${topic}</p>
          </div>
          <p style="color: #666; font-size: 12px; line-height: 1.6; margin: 24px 0 0;">
            If you need to reschedule, please reply to this email or contact us directly.
          </p>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #1e1e1e; text-align: center;">
          <p style="margin: 0; color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">American Marketing Technology</p>
        </div>
      </div>
    `;

    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AMTECH Demos <demos@mail.amtechleads.com>",
        to: ["ben@palaskasconsulting.com"],
        subject: `New Demo Booking: ${name} — ${topic}`,
        html: notificationHtml,
      }),
    });

    if (!notificationRes.ok) {
      const errText = await notificationRes.text();
      console.error("Resend notification error:", errText);
    }

    const confirmRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AMTECH <demos@mail.amtechleads.com>",
        to: [email],
        subject: `Your AMTECH Demo is Confirmed — ${bookingDate}`,
        html: confirmationHtml,
      }),
    });

    if (!confirmRes.ok) {
      const errText = await confirmRes.text();
      console.error("Resend confirmation error:", errText);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process booking email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
