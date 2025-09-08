exports.renderContactEmail = ({ name, email, service, preferredDate, message }) => {
  const BG = "#0D0D0D";
  const TEXT = "#FFFFFF";
  const MUTED = "#B3B3B3";
  const CARD = "#1A1A1A";
  const ACCENT = "#C5A46D";

  const safe = (v) => String(v || '').replace(/[<>]/g, '');
  const nl2br = (v) => safe(v).replace(/\n/g, '<br/>');
  const formatDate = (v) => {
    if (!v) return 'N/A';
    try {
      const d = new Date(v);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return safe(v);
    }
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Request</title>
  </head>
  <body style="margin:0;padding:0;background:${BG};color:${TEXT};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG};padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="background:${CARD};border:1px solid rgba(197,164,109,0.25);border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.35);">
            <tr>
              <td style="padding:26px 32px;background:linear-gradient(135deg, ${CARD} 0%, ${BG} 100%);border-bottom:1px solid rgba(197,164,109,0.25);">
                <div style="font-size:12px;letter-spacing:2px;color:${MUTED};text-transform:uppercase;">StudioPH</div>
                <h1 style="margin:6px 0 0 0;font-size:22px;line-height:1.4;color:${TEXT};">New Contact Request</h1>
                <p style="margin:6px 0 0 0;font-size:13px;color:${MUTED};">A prospective client just reached out via your website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 12px;">
                  <tr>
                    <td style="width:180px;color:${MUTED};font-size:13px;">Name</td>
                    <td style="font-size:15px;color:${TEXT};font-weight:600;">${safe(name)}</td>
                  </tr>
                  <tr>
                    <td style="width:180px;color:${MUTED};font-size:13px;">Email</td>
                    <td style="font-size:15px;color:${TEXT};"><a href="mailto:${safe(email)}" style="color:${ACCENT};text-decoration:none;">${safe(email)}</a></td>
                  </tr>
                  <tr>
                    <td style="width:180px;color:${MUTED};font-size:13px;">Service</td>
                    <td style="font-size:15px;color:${TEXT};text-transform:capitalize;">${safe(service)}</td>
                  </tr>
                  <tr>
                    <td style="width:180px;color:${MUTED};font-size:13px;">Preferred Date</td>
                    <td style="font-size:15px;color:${TEXT};">${formatDate(preferredDate)}</td>
                  </tr>
                </table>

                <div style="margin-top:22px;padding:18px;border:1px solid rgba(197,164,109,0.25);border-radius:12px;background:rgba(255,255,255,0.03);">
                  <div style="margin:0 0 10px 0;color:${MUTED};font-size:12px;letter-spacing:0.3px;">Message</div>
                  <div style="font-size:15px;line-height:1.7;color:${TEXT};">${nl2br(message)}</div>
                </div>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                  <tr>
                    <td style="background:${ACCENT};border-radius:10px;">
                      <a href="mailto:${safe(email)}" style="display:inline-block;padding:12px 18px;color:#0D0D0D;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.3px;">Reply to ${safe(name)}</a>
                    </td>
                  </tr>
                </table>

                <div style="margin-top:18px;color:${MUTED};font-size:12px;">You can reply directly to this email to continue the conversation.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;border-top:1px solid rgba(197,164,109,0.25);background:${CARD};color:${MUTED};font-size:12px;">
                © ${new Date().getFullYear()} StudioPH · Automated Notification
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};


