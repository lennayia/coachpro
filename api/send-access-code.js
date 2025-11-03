// Vercel Serverless Function - Send Access Code Email via Resend
// This runs on Vercel's server, not in the browser

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Get data from request body
  const { email, name, accessCode } = req.body;

  // Validate input
  if (!email || !name || !accessCode) {
    return res.status(400).json({
      error: 'Missing required fields: email, name, accessCode'
    });
  }

  // Get Resend API key from environment variable
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({
      error: 'Email service not configured'
    });
  }

  try {
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CoachPro <onboarding@resend.dev>', // For testing, use Resend's test domain
        to: ['lenkaroubalka@gmail.com'], // BETA: All emails go to admin during testing
        subject: `🌿 CoachPro Access Kód pro ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Tvůj CoachPro Access Kód</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">

                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #556B2F 0%, #228B22 100%); padding: 40px 40px 30px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                            🌿 CoachPro
                          </h1>
                          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                            Beta Test
                          </p>
                        </td>
                      </tr>

                      <!-- BETA INFO: Recipient Info -->
                      <tr>
                        <td style="padding: 20px 40px 0;">
                          <div style="background-color: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
                            <p style="margin: 0; color: #1565c0; font-size: 13px; font-weight: 600;">
                              📧 BETA TEST MODE: Tento email je určený pro:
                            </p>
                            <p style="margin: 4px 0 0; color: #1976d2; font-size: 14px;">
                              <strong>${name}</strong> (${email})
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                            Vítej v beta testu, ${name}! 🎉
                          </h2>

                          <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Děkujeme, že se zapojuješ do testování CoachPro aplikace! Tady je tvůj přístupový kód:
                          </p>

                          <!-- Access Code Box -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                            <tr>
                              <td style="background-color: rgba(139, 188, 143, 0.1); border: 2px solid #8FBC8F; border-radius: 12px; padding: 24px; text-align: center;">
                                <p style="margin: 0 0 8px; color: #556B2F; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                  Tvůj Access Kód
                                </p>
                                <p style="margin: 0; color: #556B2F; font-size: 36px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 4px;">
                                  ${accessCode}
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- Instructions -->
                          <div style="background-color: #f8f9fa; border-left: 4px solid #8FBC8F; padding: 16px 20px; margin: 0 0 24px; border-radius: 4px;">
                            <p style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                              📝 Jak se přihlásit:
                            </p>
                            <ol style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                              <li>Jdi na <a href="${process.env.VITE_APP_URL || 'https://coachpro.vercel.app'}" style="color: #556B2F; text-decoration: none; font-weight: 600;">CoachPro aplikaci</a></li>
                              <li>Zadej svůj access kód do pole "Máš access kód z registrace?"</li>
                              <li>Klikni na tlačítko "Vstoupit"</li>
                            </ol>
                          </div>

                          <!-- Warning -->
                          <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
                            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                              ⚠️ <strong>Ulož si tento kód!</strong> Budeš ho potřebovat při každém přihlášení. Doporučujeme uložit tento email nebo si kód zapsat.
                            </p>
                          </div>

                          <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 15px; line-height: 1.6;">
                            Pokud budeš mít jakékoliv dotazy nebo narazíš na problém, neváhej nás kontaktovat na
                            <a href="mailto:lenna@online-byznys.cz" style="color: #556B2F; text-decoration: none; font-weight: 600;">lenna@online-byznys.cz</a>
                          </p>

                          <p style="margin: 24px 0 0; color: #4a4a4a; font-size: 15px; line-height: 1.6;">
                            Těšíme se na tvůj feedback! 💚
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                          <p style="margin: 0 0 8px; color: #6c757d; font-size: 13px;">
                            © 2025 CoachPro. Aplikace pro kouče a jejich klientky.
                          </p>
                          <p style="margin: 0; color: #6c757d; font-size: 12px;">
                            Tento email byl odeslán, protože ses zaregistrovala do beta testu CoachPro.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to send email'
      });
    }

    console.log('✅ Email sent successfully:', data.id);
    return res.status(200).json({
      success: true,
      emailId: data.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}
