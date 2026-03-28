import twilio from "twilio";

interface TwilioCredentials {
  accountSid: string;
  apiKeySid?: string;
  apiKeySecret?: string;
  authToken?: string;
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

  if (!connection) {
    throw new Error("Twilio not connected");
  }

  const s = connection.settings;

  const accountSid = s.account_sid;
  if (!accountSid || !accountSid.startsWith("AC")) {
    throw new Error(
      "Twilio Account SID (starts with AC) not found in connector. " +
      "Please update your Twilio integration: put your Account SID (AC...) in the Account SID field."
    );
  }

  const apiKey = s.api_key;
  const apiKeySecret = s.api_key_secret;
  const useApiKey = apiKey && apiKey.startsWith("SK") && apiKeySecret;

  cachedCredentials = {
    accountSid,
    ...(useApiKey
      ? { apiKeySid: apiKey, apiKeySecret }
      : { authToken: apiKey || apiKeySecret }),
    phoneNumber: s.phone_number,
  };

  return cachedCredentials;
}

async function getTwilioClient() {
  const creds = await getCredentials();
  if (creds.apiKeySid && creds.apiKeySecret) {
    return twilio(creds.apiKeySid, creds.apiKeySecret, { accountSid: creds.accountSid });
  }
  return twilio(creds.accountSid, creds.authToken!);
}

async function getFromPhoneNumber(): Promise<string> {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

const ALERT_LEVEL_LABELS: Record<string, string> = {
  level4: "HIGH",
  level5: "CRITICAL",
};

export async function sendTestSMS(toPhone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await getTwilioClient();
    const fromNumber = await getFromPhoneNumber();

    await client.messages.create({
      body: "Tether HIGH Alert\nChild: Test Child\nThis is a test alert from Tether Admin Dashboard.\nOpen the Tether app to review.",
      from: fromNumber,
      to: toPhone,
    });

    return { success: true };
  } catch (err: any) {
    const message = err?.message || err?.toString() || "Unknown Twilio error";
    console.error("Test SMS error:", message);
    return { success: false, error: message };
  }
}

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
