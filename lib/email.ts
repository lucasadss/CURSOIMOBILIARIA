/**
 * Transactional email through Resend's REST API (no SDK needed for one call).
 * Server-only — RESEND_API_KEY must never reach the client.
 */

const BRAND = "#e86a24";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function magicLinkEmail(link: string) {
  const href = escapeHtml(link);

  const html = `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f4f1ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Seu acesso à IMOVIX está pronto — é só clicar no botão.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ee;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#171717;border-radius:20px;overflow:hidden;">
        <tr><td style="height:4px;background:${BRAND};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td align="center" style="padding:36px 32px 8px;">
          <span style="font-size:26px;font-weight:800;letter-spacing:0.14em;color:#ffffff;">IMOVIX</span>
        </td></tr>
        <tr><td align="center" style="padding:20px 32px 0;">
          <h1 style="margin:0;font-size:24px;line-height:1.25;color:#ffffff;font-weight:800;">Seu acesso está liberado</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.55;color:#b9b4ae;">Clique no botão abaixo para entrar na plataforma e começar a criar seus prompts profissionais para imóveis.</p>
        </td></tr>
        <tr><td align="center" style="padding:28px 32px 8px;">
          <a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 36px;border-radius:12px;">Entrar na IMOVIX</a>
        </td></tr>
        <tr><td align="center" style="padding:20px 32px 0;">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#8a857f;">Este link é pessoal, vale por 1 hora e só pode ser usado uma vez.</p>
        </td></tr>
        <tr><td style="padding:28px 32px 0;"><div style="height:1px;background:#2a2a2a;"></div></td></tr>
        <tr><td style="padding:20px 32px 32px;">
          <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:#8a857f;">O botão não funciona? Copie e cole este endereço no navegador:</p>
          <p style="margin:0 0 14px;font-size:12px;line-height:1.5;word-break:break-all;"><a href="${href}" style="color:${BRAND};">${href}</a></p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#8a857f;">Não pediu este acesso? Pode ignorar este e-mail com segurança — ninguém consegue entrar sem clicar no link.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    "Seu acesso à IMOVIX está liberado.",
    "",
    "Entre pelo link abaixo (pessoal, vale por 1 hora e só pode ser usado uma vez):",
    link,
    "",
    "Não pediu este acesso? Ignore este e-mail com segurança.",
  ].join("\n");

  return { subject: "Seu acesso à IMOVIX está liberado", html, text };
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "IMOVIX <acesso@imovixai.site>";
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend rejected the send:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Resend request failed:", err);
    return false;
  }
}
