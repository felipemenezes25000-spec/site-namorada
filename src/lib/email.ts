import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/** E-mail de destino para notificações de lead. */
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "draanabeatrizodontologia@gmail.com";

/** Remetente — usar domínio verificado no Resend quando disponível. */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Site Dra. Ana <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(resend);
}

interface LeadEmailData {
  fullName: string;
  whatsapp: string;
  email?: string | null;
  treatmentInterest: string;
  preferredPeriod?: string | null;
  preferredDate?: string | null;
  hasXray?: string | null;
  mainComplaint?: string | null;
  source?: string | null;
  /** Atribuição de campanha — presente quando o lead veio de anúncio. */
  gclid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
}

export async function sendLeadNotification(data: LeadEmailData) {
  if (!resend) return { ok: false, reason: "not_configured" };

  // Escapa HTML — os valores vêm do formulário e de parâmetros de URL (UTM).
  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const rows = [
    `<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Nome</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.fullName)}</td></tr>`,
    `<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">WhatsApp</td><td style="padding:8px 12px;border-bottom:1px solid #eee"><a href="https://wa.me/55${data.whatsapp.replace(/\D/g, "")}" style="color:#25D366">${esc(data.whatsapp)}</a></td></tr>`,
  ];

  if (data.email) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.email)}</td></tr>`);
  rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Tratamento</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.treatmentInterest)}</td></tr>`);
  if (data.preferredPeriod) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Período</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.preferredPeriod)}</td></tr>`);
  if (data.preferredDate) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Melhor dia</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.preferredDate)}</td></tr>`);
  if (data.hasXray) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Exame radiográfico</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${data.hasXray === "sim" ? "Sim" : "Não"}</td></tr>`);
  if (data.mainComplaint) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Queixa</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.mainComplaint)}</td></tr>`);
  if (data.source) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Como conheceu</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.source)}</td></tr>`);

  // Origem de campanha — mostra de qual anúncio/campanha o lead veio.
  const originParts: string[] = [];
  if (data.gclid) originParts.push("Google Ads");
  if (data.utmSource) originParts.push(`${data.utmSource}${data.utmMedium ? ` / ${data.utmMedium}` : ""}`);
  if (data.utmCampaign) originParts.push(`campanha: ${data.utmCampaign}`);
  if (originParts.length) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Origem (anúncio)</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(originParts.join(" · "))}</td></tr>`);
  if (data.landingPage) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">Página de entrada</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(data.landingPage)}</td></tr>`);
  if (data.gclid) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee">ID do clique (gclid)</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:11px;word-break:break-all">${esc(data.gclid)}</td></tr>`);

  const whatsappNumber = data.whatsapp.replace(/\D/g, "");
  const waLink = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(`Olá, ${data.fullName.split(" ")[0]}! Recebi sua solicitação pelo site e gostaria de confirmar seu agendamento.`)}`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#333">
      <div style="background:#1a3c2a;padding:24px 20px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;font-size:18px;margin:0">Novo lead pelo site</h1>
        <p style="color:#c9a96e;font-size:14px;margin:6px 0 0">Alguém preencheu o formulário de agendamento</p>
      </div>
      <div style="background:#fff;padding:20px;border:1px solid #eee;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.join("\n")}
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
            Responder no WhatsApp
          </a>
        </div>
      </div>
      <div style="padding:16px 20px;text-align:center;font-size:12px;color:#999;border-radius:0 0 12px 12px;background:#f9f9f9;border:1px solid #eee;border-top:none">
        Enviado automaticamente pelo site draanabeatrizodonto.com.br
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `Novo lead: ${data.fullName} — ${data.treatmentInterest}`,
      html,
    });
    if (error) {
      console.error("[email] resend error:", error);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] unexpected error:", err);
    return { ok: false, reason: "send_failed" };
  }
}
