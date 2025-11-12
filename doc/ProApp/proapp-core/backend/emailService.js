import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend only if API key is present
let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend email service initialized');
} else {
  console.warn('⚠️ RESEND_API_KEY not set - email features will be disabled');
}

// TVOJE PŮVODNÍ FUNKCE - zachované beze změny
export const sendPaymentReminder = async (to, paymentData) => {
  if (!resend) {
    console.warn('⚠️ Email sending skipped - Resend not configured');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'DigiPro Payments <onboarding@resend.dev>',
      to: [to],
      subject: `💰 Platba "${paymentData.title}" je splatná ${paymentData.due_date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">🔔 Upozornění na platbu</h2>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Platba:</strong> ${paymentData.title}</p>
            <p><strong>Částka:</strong> <span style="color: #059669; font-size: 18px;">${paymentData.amount} ${paymentData.currency}</span></p>
            <p><strong>Splatnost:</strong> ${paymentData.due_date}</p>
            ${paymentData.notes ? `<p><strong>Poznámky:</strong> ${paymentData.notes}</p>` : ''}
          </div>
          
          <p>Nezapomeň zaplatit! 😊</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
          <small style="color: #666;">Odesláno z DigiPro Payments App</small>
        </div>
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Error sending payment reminder:', err);
    throw err;
  }
};

export const sendTestEmail = async (to) => {
  if (!resend) {
    console.warn('⚠️ Email sending skipped - Resend not configured');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    console.log('🔍 Sending email to:', to);
    console.log('🔍 API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('🔍 API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 5));

    const { data, error } = await resend.emails.send({
      from: 'DigiPro Payments <onboarding@resend.dev>',
      to: [to],
      subject: '✅ Test email z DigiPro Payments',
      html: '<h1>RESEND TEST</h1>'
    });

    console.log('🔍 Resend response data:', data);
    console.log('🔍 Resend response error:', error);

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(JSON.stringify(error));
    }

    return data;
  } catch (err) {
    console.error('❌ Catch block error:', err);
    console.error('❌ Error type:', typeof err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Full error:', err);
    throw err;
  }
};

// NOVÉ FUNKCE PRO RESET HESLA
export const sendPasswordResetEmail = async (to, resetToken, firstName) => {
  if (!resend) {
    console.warn('⚠️ Password reset email skipped - Resend not configured');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    console.log('🔍 Sending password reset email to:', to);
    console.log('🔍 Reset URL:', resetUrl);

    const { data, error } = await resend.emails.send({
      from: 'DigiPro Payments <onboarding@resend.dev>',
      to: [to],
      subject: '🔐 Reset hesla - DigiPro Payments',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1976D2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🔐 Reset hesla</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Ahoj ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Obdrželi jsme požadavek na reset hesla pro tvůj účet v aplikaci <strong>DigiPro Payments</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #1976D2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Nastavit nové heslo
              </a>
            </div>
            
            <div style="background: #fff; padding: 15px; border-radius: 6px; border-left: 4px solid #1976D2; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Link pro reset:</strong><br>
                <span style="word-break: break-all;">${resetUrl}</span>
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Důležité:</strong> Tento link vyprší za <strong>1 hodinu</strong>.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Pokud jsi o reset hesla nežádal/a, můžeš tento email klidně ignorovat. 
              Tvé heslo zůstane beze změny.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Tento email byl odeslán automaticky z aplikace DigiPro Payments</p>
            <p>Neodpovídej na tento email</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend API error při reset emailu:', error);
      throw new Error(JSON.stringify(error));
    }

    console.log('✅ Reset email odeslán:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('❌ Chyba při odesílání reset emailu:', err);
    throw err;
  }
};

export const sendWelcomeEmail = async (to, firstName) => {
  if (!resend) {
    console.warn('⚠️ Welcome email skipped - Resend not configured');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    console.log('🔍 Sending welcome email to:', to);

    const { data, error } = await resend.emails.send({
      from: 'DigiPro Payments <onboarding@resend.dev>',
      to: [to],
      subject: '🎉 Vítej v DigiPro Payments!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎉 Vítej v DigiPro!</h1>
          </div>
          
          <div style="background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Ahoj ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Tvůj účet byl úspěšně vytvořen! 🎉
            </p>
            
            <div style="background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">Co můžeš s DigiPro dělat:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li>📊 Spravovat platby a faktury</li>
                <li>🔔 Dostávat připomínky splatnosti</li>
                <li>📈 Sledovat finanční přehledy</li>
                <li>⚡ Automatizovat opakující se platby</li>
              </ul>
            </div>
            
            <p style="color: #666;">
              Můžeš se hned přihlásit a začít používat aplikaci!
            </p>
            
            <p style="color: #059669; font-weight: bold; margin-top: 30px;">
              Tým DigiPro 💚
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Tento email byl odeslán automaticky z aplikace DigiPro Payments</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend API error při uvítacím emailu:', error);
      throw new Error(JSON.stringify(error));
    }

    console.log('✅ Uvítací email odeslán:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('❌ Chyba při odesílání uvítacího emailu:', err);
    throw err;
  }
};