import twilio from "twilio";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X-Replit-Token not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=twilio",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  ).then(res => res.json()).then((data: any) => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error("Twilio not connected");
  }

  return {
    accountSid: connectionSettings.settings.account_sid as string,
    apiKey: connectionSettings.settings.api_key as string,
    apiKeySecret: connectionSettings.settings.api_key_secret as string,
    phoneNumber: connectionSettings.settings.phone_number as string,
  };
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
    const code = err?.code;
    const status = err?.status;
    console.error("Test SMS error:", { message, code, status, moreInfo: err?.moreInfo });
    return { success: false, error: `${message}${code ? ` (code: ${code})` : ''}` };
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
