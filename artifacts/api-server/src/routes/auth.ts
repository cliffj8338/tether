import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { RegisterParentBody, LoginUserBody, ChildLoginBody } from "@workspace/api-zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

const BCRYPT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.length === 64 && /^[a-f0-9]+$/.test(hash)) {
    const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
    if (legacyHash === hash) {
      return true;
    }
  }
  return bcrypt.compare(password, hash);
}

function generateToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

function generateFamilyCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `TETHER-${code}`;
}

function userResponse(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    parentId: user.parentId,
    avatarColor: user.avatarColor,
    trustLevel: user.trustLevel,
    faithModeEnabled: user.faithModeEnabled,
    isPaused: user.isPaused,
    phone: user.phone,
    familyCode: user.familyCode,
  };
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, maxAttempts = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  if (entry.count > maxAttempts) {
    return false;
  }
  return true;
}

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterParentBody.parse(req.body);

    const ip = req.ip || "unknown";
    if (!checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
      res.status(429).json({ error: "Too many registration attempts. Try again later." });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    let familyCode = generateFamilyCode();
    let attempts = 0;
    while (attempts < 5) {
      const [dup] = await db.select().from(usersTable).where(eq(usersTable.familyCode, familyCode));
      if (!dup) break;
      familyCode = generateFamilyCode();
      attempts++;
    }

    const hashedPassword = await hashPassword(body.password);
    const token = generateToken();

    const [user] = await db.insert(usersTable).values({
      email: body.email,
      displayName: body.displayName,
      role: "parent",
      pin: hashedPassword,
      familyCode,
      passwordHash: token,
    }).returning();
    res.status(201).json({ user: userResponse(user), token });
  } catch (error) {
    req.log.error(error, "Registration failed");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginUserBody.parse(req.body);

    const key = `login:${body.email}`;
    if (!checkRateLimit(key, 10)) {
      res.status(429).json({ error: "Too many login attempts. Try again in 15 minutes." });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user || !user.pin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await verifyPassword(body.password, user.pin);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (user.pin.length === 64 && /^[a-f0-9]+$/.test(user.pin)) {
      const upgraded = await hashPassword(body.password);
      await db.update(usersTable).set({ pin: upgraded }).where(eq(usersTable.id, user.id));
    }

    const token = generateToken();
    await db.update(usersTable).set({ passwordHash: token }).where(eq(usersTable.id, user.id));

    res.json({ user: userResponse(user), token });
  } catch (error) {
    req.log.error(error, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/child-login", async (req, res) => {
  try {
    const { parentEmail, familyCode, childName, pin } = req.body;
    if ((!parentEmail && !familyCode) || !childName || !pin) {
      res.status(400).json({ error: "familyCode (or parentEmail), childName, and pin are required" });
      return;
    }
    if (typeof pin !== "string" || !/^\d{4,6}$/.test(pin)) {
      res.status(400).json({ error: "PIN must be 4-6 digits" });
      return;
    }

    const key = `child-login:${familyCode || parentEmail}:${childName}`;
    if (!checkRateLimit(key, 5, 10 * 60 * 1000)) {
      res.status(429).json({ error: "Too many login attempts. Try again in 10 minutes." });
      return;
    }

    let parent;
    if (familyCode) {
      const [found] = await db.select().from(usersTable).where(
        and(eq(usersTable.familyCode, familyCode.toUpperCase()), eq(usersTable.role, "parent"))
      );
      parent = found;
    } else {
      const [found] = await db.select().from(usersTable).where(
        and(eq(usersTable.email, parentEmail), eq(usersTable.role, "parent"))
      );
      parent = found;
    }

    if (!parent) {
      res.status(401).json({ error: familyCode ? "Invalid family code" : "Parent account not found" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(
      and(
        eq(usersTable.parentId, parent.id),
        eq(usersTable.displayName, childName),
        eq(usersTable.role, "child"),
      )
    );
    if (!user || !user.pin) {
      res.status(401).json({ error: "Invalid PIN" });
      return;
    }

    const valid = await verifyPassword(pin, user.pin);
    if (!valid) {
      res.status(401).json({ error: "Invalid PIN" });
      return;
    }

    if (user.pin.length === 64 && /^[a-f0-9]+$/.test(user.pin)) {
      const upgraded = await hashPassword(pin);
      await db.update(usersTable).set({ pin: upgraded }).where(eq(usersTable.id, user.id));
    }

    const token = generateToken();
    await db.update(usersTable).set({ passwordHash: token }).where(eq(usersTable.id, user.id));

    res.json({ user: userResponse(user), token });
  } catch (error) {
    req.log.error(error, "Child login failed");
    res.status(500).json({ error: "Child login failed" });
  }
});

router.post("/auth/join-family", async (req, res) => {
  try {
    const { familyCode, childName, pin, age, grade } = req.body;
    if (!familyCode || !childName || !pin) {
      res.status(400).json({ error: "familyCode, childName, and pin are required" });
      return;
    }
    if (typeof pin !== "string" || !/^\d{4,6}$/.test(pin)) {
      res.status(400).json({ error: "PIN must be 4-6 digits" });
      return;
    }
    if (age !== undefined && (typeof age !== "number" || age < 3 || age > 17 || !Number.isInteger(age))) {
      res.status(400).json({ error: "Age must be a whole number between 3 and 17" });
      return;
    }

    const [parent] = await db.select().from(usersTable).where(
      and(eq(usersTable.familyCode, familyCode.toUpperCase()), eq(usersTable.role, "parent"))
    );
    if (!parent) {
      res.status(404).json({ error: "Invalid family code" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(
      and(
        eq(usersTable.parentId, parent.id),
        eq(usersTable.displayName, childName),
        eq(usersTable.role, "child"),
      )
    );
    if (existing) {
      res.status(400).json({ error: "A child with that name already exists in this family" });
      return;
    }

    const colors = ["#7B8EC4", "#E8A87C", "#85CDCA", "#D4A5A5", "#9ED2C6"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const hashedPin = await hashPassword(pin);
    const token = generateToken();

    const [child] = await db.insert(usersTable).values({
      displayName: childName,
      role: "child",
      parentId: parent.id,
      pin: hashedPin,
      age: age ?? null,
      grade: grade ?? null,
      avatarColor,
      passwordHash: token,
    }).returning();

    res.status(201).json({ user: userResponse(child), token });
  } catch (error) {
    req.log.error(error, "Join family failed");
    res.status(500).json({ error: "Join family failed" });
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const ip = req.ip || "unknown";
    if (!checkRateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000)) {
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    res.json({ message: "If that email exists, a reset link has been sent." });

    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await db.update(usersTable)
      .set({ resetToken, resetTokenExpires: expires })
      .where(eq(usersTable.id, user.id));

    try {
      const { sendEmail } = await import("../lib/email");
      await sendEmail({
        to: email,
        subject: "Reset Your Tether Password",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #7C9A82; font-size: 28px; margin: 0;">Tether</h1>
            </div>
            <h2 style="color: #1F2937;">Password Reset</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hi ${user.displayName},<br/><br/>
              You requested a password reset. Use this code in the app to set a new password:
            </p>
            <div style="background: #F0F5F1; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1F2937;">${resetToken.slice(0, 8).toUpperCase()}</span>
            </div>
            <p style="color: #6B7280; font-size: 14px;">This code expires in 1 hour. If you didn't request this, you can ignore this email.</p>
            <p style="color: #6B7280; font-size: 14px; margin-top: 40px;">— The Tether Team</p>
          </div>
        `,
        text: `Hi ${user.displayName},\n\nYour password reset code is: ${resetToken.slice(0, 8).toUpperCase()}\n\nThis code expires in 1 hour.\n\n— The Tether Team`,
      });
    } catch (emailErr) {
      console.error("Failed to send reset email:", emailErr);
    }
  } catch (error) {
    req.log.error(error, "Forgot password failed");
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ error: "Email, code, and newPassword are required" });
      return;
    }

    const ip = req.ip || "unknown";
    if (!checkRateLimit(`reset:${ip}:${email}`, 5, 15 * 60 * 1000)) {
      res.status(429).json({ error: "Too many reset attempts. Try again in 15 minutes." });
      return;
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || !user.resetToken || !user.resetTokenExpires) {
      res.status(400).json({ error: "Invalid or expired reset code" });
      return;
    }

    if (new Date() > user.resetTokenExpires) {
      res.status(400).json({ error: "Reset code has expired" });
      return;
    }

    const codeNormalized = code.toUpperCase().trim();
    const expectedCode = user.resetToken.slice(0, 8).toUpperCase();
    if (codeNormalized.length !== expectedCode.length ||
        !crypto.timingSafeEqual(Buffer.from(codeNormalized), Buffer.from(expectedCode))) {
      res.status(400).json({ error: "Invalid reset code" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    const newToken = generateToken();
    await db.update(usersTable)
      .set({ pin: hashedPassword, passwordHash: newToken, resetToken: null, resetTokenExpires: null })
      .where(eq(usersTable.id, user.id));

    res.json({ message: "Password reset successfully", token: newToken, user: userResponse(user) });
  } catch (error) {
    req.log.error(error, "Reset password failed");
    res.status(500).json({ error: "Failed to reset password" });
  }
});

router.delete("/users/me", async (req, res) => {
  try {
    const { getUserFromToken } = await import("../lib/auth");
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.role === "parent") {
      await db.delete(usersTable).where(eq(usersTable.parentId, user.id));
    }
    await db.delete(usersTable).where(eq(usersTable.id, user.id));

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    req.log.error(error, "Delete account failed");
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
