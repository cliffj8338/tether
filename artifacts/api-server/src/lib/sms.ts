import twilio from "twilio";

interface TwilioCredentials {
  accountSid: string;
  apiKey: string;
  apiKeySecret: string;
  phoneNumber: string;
}

let cachedCredentials: TwilioCredentials | null = null;

async function getCredentials(): Promise<TwilioCredentials> {
  if (cachedCredentials) return cachedCredentials;

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken || !hostname) {
    throw new Error("Twilio credentials not available");
  }

  const res = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=twilio",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  );

  const data = (await res.json()) as { items?: Array<{ settings: Record<string, string> }> };
  const connection = data.items?.[0];

  if (
    !connection ||
    !connection.settings.account_sid ||
    !connection.settings.api_key ||
    !connection.settings.api_key_secret
  ) {
    throw new Error("Twilio not connected");
  }

  cachedCredentials = {
    accountSid: connection.settings.account_sid,
    apiKey: connection.settings.api_key,
    apiKeySecret: connection.settings.api_key_secret,
    phoneNumber: connection.settings.phone_number,
  };

  return cachedCredentials;
}

async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, { accountSid });
}

async function getFromPhoneNumber(): Promise<string> {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

const ALERT_LEVEL_LABELS: Record<string, string> = {
  level4: "HIGH",
  level5: "CRITICAL",
};

export async function sendAlertSMS(
  toPhone: string,
  alertLevel: string,
  childName: string,
  alertTitle: string
): Promise<boolean> {
  if (!toPhone) return false;

  const levelLabel = ALERT_LEVEL_LABELS[alertLevel];
  if (!levelLabel) return false;

  try {
    const client = await getTwilioClient();
    const fromNumber = await getFromPhoneNumber();

    const body =
      `Tether ${levelLabel} Alert\n` +
      `Child: ${childName}\n` +
      `${alertTitle}\n` +
      `Open the Tether app to review.`;

    await client.messages.create({
      body,
      from: fromNumber,
      to: toPhone,
    });

    return true;
  } catch {
    return false;
  }
}
