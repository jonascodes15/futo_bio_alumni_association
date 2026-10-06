import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "FUTO Bio Alumni <onboarding@resend.dev>";

let client: Resend | null = null;
function resend() {
  if (!process.env.RESEND_API_KEY) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wraps body HTML in the branded email shell. */
export function emailShell(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#15231b">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0b5d33;padding:22px 28px;color:#fff">
<div style="font-size:12px;letter-spacing:2px;color:#f5c518;text-transform:uppercase">FUTO Department of Biology</div>
<div style="font-size:20px;font-weight:bold;margin-top:4px">Alumni Association</div></td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6">${inner}</td></tr>
<tr><td style="background:#f3f6f4;padding:16px 28px;font-size:12px;color:#5b6b62">
Federal University of Technology, Owerri &middot; Technology for Service</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string }) {
  const r = resend();
  if (!r) {
    console.warn("[email] RESEND_API_KEY missing; skipped:", opts.subject);
    return { ok: false as const, error: "RESEND_API_KEY not configured" };
  }
  const { error } = await r.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export function welcomeEmail(fullName: string, whatsapp: string) {
  const first = escapeHtml(fullName.split(" ")[0] || "Bioscientist");
  const wa = whatsapp
    ? `<p style="margin:24px 0"><a href="${escapeHtml(whatsapp)}" style="background:#f5c518;color:#0b2b1a;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Join the Official WhatsApp Group</a></p>`
    : "";
  return emailShell(`
<h2 style="margin:0 0 12px;color:#0b5d33">Welcome to the network, ${first}!</h2>
<p>Thank you for registering in the Global Alumni Census of the FUTO Department of Biology Alumni Association. You are now part of the first-ever network connecting our bioscientists across the globe.</p>
<p>Here is what happens next:</p>
<ul><li>Your details are added to the alumni directory.</li><li>We will share updates on mentorship, research grants and laboratory support.</li><li>Join the community on WhatsApp to meet fellow alumni.</li></ul>
${wa}
<p>Warm regards,<br/>Interim Executive Council</p>`);
}
