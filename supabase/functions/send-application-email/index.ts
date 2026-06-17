import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ApplicationData {
  full_name: string;
  email: string;
  phone: string;
  city_state: string;
  experience_level: string;
  cold_call_experience: string;
  lead_source: string;
  lead_source_other?: string;
  hours_per_week: string;
  monthly_goal: string;
  budget_range: string;
  target_market: string;
  property_types: string[];
  price_range: string;
  buyers_list?: string;
  why_now: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { application }: { application: ApplicationData } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const summaryRows = [
      ["Full Name", application.full_name],
      ["Email", application.email],
      ["Phone", application.phone],
      ["City / State", application.city_state],
      ["Experience Level", application.experience_level],
      ["Cold Call Background", application.cold_call_experience],
      ["Lead Source", application.lead_source + (application.lead_source_other ? ` — ${application.lead_source_other}` : "")],
      ["Hours per Week", application.hours_per_week],
      ["Monthly Goal", application.monthly_goal],
      ["Budget Range", application.budget_range],
      ["Target Market", application.target_market],
      ["Property Types", application.property_types.join(", ")],
      ["Price Range / ARV", application.price_range],
      ["Buyers List", application.buyers_list || "Not provided"],
      ["Why Now", application.why_now],
    ];

    const summaryHtml = summaryRows
      .map(([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #222;color:#6b7280;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #222;color:#ffffff;font-size:15px;vertical-align:top;">${value}</td>
        </tr>`)
      .join("");

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#fff;font-family:Inter,Arial,sans-serif;margin:0;padding:32px;">
        <div style="max-width:640px;margin:0 auto;">
          <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#E11D2A;margin-bottom:24px;">NEW OPERATOR APPLICATION</p>
          <h1 style="font-size:32px;font-weight:900;color:#fff;margin:0 0 8px 0;">${application.full_name}</h1>
          <p style="color:#6b7280;font-size:14px;margin:0 0 32px 0;">${application.email} · ${application.phone}</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #222;">
            ${summaryHtml}
          </table>
          <div style="margin-top:32px;padding:20px;border:1px solid #E11D2A;">
            <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280;margin:0 0 8px 0;">WHY NOW</p>
            <p style="color:#fff;font-size:15px;line-height:1.7;margin:0;">"${application.why_now}"</p>
          </div>
        </div>
      </body>
      </html>`;

    const applicantHtml = `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#fff;font-family:Inter,Arial,sans-serif;margin:0;padding:32px;">
        <div style="max-width:560px;margin:0 auto;text-align:center;padding-top:48px;">
          <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#E11D2A;margin-bottom:24px;">APPLICATION RECEIVED</p>
          <h1 style="font-size:40px;font-weight:900;color:#fff;margin:0 0 24px 0;">You're in.</h1>
          <p style="color:#6b7280;font-size:17px;line-height:1.75;margin:0 0 16px 0;">
            We received your application, ${application.full_name}.
          </p>
          <p style="color:#6b7280;font-size:17px;line-height:1.75;margin:0 0 16px 0;">
            Within 48 hours you will receive a link to schedule your intake call. On that call we review your market, configure your agent, and schedule your first batch campaign.
          </p>
          <p style="color:#6b7280;font-size:17px;line-height:1.75;margin:0 0 40px 0;">
            Come ready to run.
          </p>
          <p style="color:#fff;font-size:18px;font-weight:600;margin:0;">
            Welcome to AMTECH Operators.
          </p>
          <p style="margin-top:48px;color:#444;font-size:12px;">AMTECH · ben@amtechai.com</p>
        </div>
      </body>
      </html>`;

    const emails = [
      {
        from: "AMTECH <noreply@amtechai.com>",
        to: ["ben@amtechai.com"],
        subject: `New Operator Application — ${application.full_name}`,
        html: adminHtml,
      },
      {
        from: "AMTECH Operators <noreply@amtechai.com>",
        to: [application.email],
        subject: "Application received — AMTECH Operators",
        html: applicantHtml,
      },
    ];

    if (RESEND_API_KEY) {
      for (const email of emails) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
