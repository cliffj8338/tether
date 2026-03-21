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

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterParentBody.parse(req.body);
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      email: body.email,
      displayName: body.displayName,
      role: "parent",
      pin: hashPassword(body.password),
    }).returning();
    const token = generateToken(user.id);
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        parentId: user.parentId,
        avatarColor: user.avatarColor,
        trustLevel: user.trustLevel,
        faithModeEnabled: user.faithModeEnabled,
        isPaused: user.isPaused,
      },
      token,
    });
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
    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        parentId: user.parentId,
        avatarColor: user.avatarColor,
        trustLevel: user.trustLevel,
        faithModeEnabled: user.faithModeEnabled,
        isPaused: user.isPaused,
      },
      token,
    });
  } catch (error) {
    req.log.error(error, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/child-login", async (req, res) => {
  try {
    const { parentEmail, childName, pin } = req.body;
    if (!parentEmail || !childName || !pin) {
      res.status(400).json({ error: "parentEmail, childName, and pin are required" });
      return;
    }
    const [parent] = await db.select().from(usersTable).where(
      and(eq(usersTable.email, parentEmail), eq(usersTable.role, "parent"))
    );
    if (!parent) {
      res.status(401).json({ error: "Parent account not found" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(
      and(
        eq(usersTable.parentId, parent.id),
        eq(usersTable.displayName, childName),
        eq(usersTable.role, "child"),
      )
    );
    if (!user || user.pin !== pin) {
      res.status(401).json({ error: "Invalid PIN" });
      return;
    }
    const token = generateToken(user.id);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        parentId: user.parentId,
        avatarColor: user.avatarColor,
        trustLevel: user.trustLevel,
        faithModeEnabled: user.faithModeEnabled,
        isPaused: user.isPaused,
      },
      token,
    });
  } catch (error) {
    req.log.error(error, "Child login failed");
    res.status(500).json({ error: "Child login failed" });
  }
});

export default router;
