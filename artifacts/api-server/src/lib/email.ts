import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data: any) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email,
  };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}) {
  const { client, fromEmail } = await getResendClient();

  const result = await client.emails.send({
    from: fromEmail || 'Tether <hello@tetherapp.app>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
  } as any);

  return result;
}

export async function sendWaitlistConfirmation(email: string, name?: string) {
  const greeting = name ? `Hi ${name}` : 'Hi there';
  return sendEmail({
    to: email,
    subject: 'Welcome to the Tether Waitlist!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #7C9A82; font-size: 28px; margin: 0;">Tether</h1>
          <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">Safe Messaging for Kids</p>
        </div>
        <h2 style="color: #1F2937; font-size: 22px;">${greeting},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for joining the Tether waitlist! We're building something special — a messaging platform designed from the ground up to keep kids safe while helping them learn healthy communication habits.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          You'll be among the first to know when Tether launches. We'll send you updates on our progress and early access opportunities.
        </p>
        <div style="background: #F0F5F1; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0;">
            <strong>What makes Tether different:</strong><br/>
            ✅ Graduated trust system that grows with your child<br/>
            ✅ Faith Mode for values-aligned communication<br/>
            ✅ Parent oversight without invasive surveillance<br/>
            ✅ Anti-addiction controls built in
          </p>
        </div>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          In the meantime, visit <a href="https://tetherapp.app" style="color: #7C9A82; text-decoration: underline;">tetherapp.app</a> to learn more about our mission.
        </p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 40px;">
          — The Tether Team
        </p>
      </div>
    `,
    text: `${greeting},\n\nThank you for joining the Tether waitlist! We're building something special — a messaging platform designed from the ground up to keep kids safe while helping them learn healthy communication habits.\n\nYou'll be among the first to know when Tether launches. We'll send you updates on our progress and early access opportunities.\n\nVisit https://tetherapp.app to learn more.\n\n— The Tether Team`,
  });
}
