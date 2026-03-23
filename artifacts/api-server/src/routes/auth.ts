import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { RegisterParentBody, LoginUserBody, ChildLoginBody } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken(userId: number): string {
  return crypto.randomBytes(32).toString("hex") + "." + userId;
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

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterParentBody.parse(req.body);
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

    const [user] = await db.insert(usersTable).values({
      email: body.email,
      displayName: body.displayName,
      role: "parent",
      pin: hashPassword(body.password),
      familyCode,
    }).returning();
    const token = generateToken(user.id);
    res.status(201).json({ user: userResponse(user), token });
  } catch (error) {
    req.log.error(error, "Registration failed");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginUserBody.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user || user.pin !== hashPassword(body.password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken(user.id);
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
    if (!user || user.pin !== hashPassword(pin)) {
      res.status(401).json({ error: "Invalid PIN" });
      return;
    }
    const token = generateToken(user.id);
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

    const [child] = await db.insert(usersTable).values({
      displayName: childName,
      role: "child",
      parentId: parent.id,
      pin: hashPassword(pin),
      age: age ?? null,
      grade: grade ?? null,
      avatarColor,
    }).returning();

    const token = generateToken(child.id);
    res.status(201).json({ user: userResponse(child), token });
  } catch (error) {
    req.log.error(error, "Join family failed");
    res.status(500).json({ error: "Join family failed" });
  }
});

export default router;
