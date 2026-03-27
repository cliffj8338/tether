import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, waitlistTable } from "@workspace/db";
import { desc, count, eq, sql, ilike, or, and, type SQL } from "drizzle-orm";
import { requireAdmin } from "../lib/require-admin";
import { sendTestSMS } from "../lib/sms";

const router: IRouter = Router();

router.use("/admin/ops", requireAdmin);

router.get("/admin/ops/waitlist", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const role = req.query.role as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      const searchCond = or(
        ilike(waitlistTable.email, `%${search}%`),
        ilike(waitlistTable.name, `%${search}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }
    if (role && role !== "all") {
      conditions.push(eq(waitlistTable.role, role as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const entries = await db
      .select()
      .from(waitlistTable)
      .where(whereClause)
      .orderBy(desc(waitlistTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [filteredCount] = await db
      .select({ count: count() })
      .from(waitlistTable)
      .where(whereClause);

    const roleCounts = await db
      .select({ role: waitlistTable.role, count: count() })
      .from(waitlistTable)
      .groupBy(waitlistTable.role);

    res.json({
      entries,
      total: filteredCount.count,
      page,
      limit,
      roleCounts: Object.fromEntries(roleCounts.map(r => [r.role, r.count])),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/ops/users", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const role = req.query.role as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      const searchCond = or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.displayName, `%${search}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }
    if (role && role !== "all") {
      conditions.push(eq(usersTable.role, role as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        displayName: usersTable.displayName,
        role: usersTable.role,
        parentId: usersTable.parentId,
        grade: usersTable.grade,
        age: usersTable.age,
        trustLevel: usersTable.trustLevel,
        faithModeEnabled: usersTable.faithModeEnabled,
        isPaused: usersTable.isPaused,
        isAdmin: usersTable.isAdmin,
        avatarColor: usersTable.avatarColor,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(whereClause)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [filteredCount] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(whereClause);

    const [parentCount] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "parent"));
    const [childCount] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "child"));
    const [adminCount] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isAdmin, true));

    res.json({
      users,
      total: filteredCount.count,
      page,
      limit,
      roleCounts: { parent: parentCount.count, child: childCount.count, admin: adminCount.count },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/ops/users/:id/toggle-admin", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId) || userId <= 0) return res.status(400).json({ error: "Invalid user ID" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    await db.update(usersTable).set({ isAdmin: !user.isAdmin }).where(eq(usersTable.id, userId));
    res.json({ ok: true, isAdmin: !user.isAdmin });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/ops/users/:id/toggle-pause", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId) || userId <= 0) return res.status(400).json({ error: "Invalid user ID" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    await db.update(usersTable).set({ isPaused: !user.isPaused }).where(eq(usersTable.id, userId));
    res.json({ ok: true, isPaused: !user.isPaused });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/ops/system-status", async (_req, res) => {
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - dbStart;

    const [userCount] = await db.select({ count: count() }).from(usersTable);
    const [waitlistCount] = await db.select({ count: count() }).from(waitlistTable);

    async function checkConnector(connectorName: string): Promise<{ connected: boolean; details: string }> {
      try {
        const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
        const xReplitToken = process.env.REPL_IDENTITY
          ? "repl " + process.env.REPL_IDENTITY
          : process.env.WEB_REPL_RENEWAL
          ? "depl " + process.env.WEB_REPL_RENEWAL
          : null;
        if (!xReplitToken || !hostname) return { connected: false, details: "Connector host unavailable" };
        const resp = await fetch(
          `https://${hostname}/api/v2/connection?include_secrets=false&connector_names=${connectorName}`,
          { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
        );
        const data = await resp.json() as { items?: Array<{ settings: Record<string, string> }> };
        if (data.items && data.items.length > 0) return { connected: true, details: "Connected via Replit integration" };
        return { connected: false, details: "Not configured" };
      } catch {
        return { connected: false, details: "Check failed" };
      }
    }

    const [twilioCheck, resendCheck, revenuecatCheck] = await Promise.all([
      checkConnector("twilio"),
      checkConnector("resend"),
      checkConnector("revenuecat"),
    ]);

    const services = [
      {
        name: "PostgreSQL Database",
        status: "operational" as const,
        latency: dbLatency,
        details: `${userCount.count} users, ${waitlistCount.count} waitlist entries`,
      },
      {
        name: "API Server",
        status: "operational" as const,
        latency: 0,
        details: `Node.js ${process.version}`,
      },
      {
        name: "Firebase Auth",
        status: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "operational" as const : "degraded" as const,
        latency: null,
        details: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "Service account configured" : "Missing service account key",
      },
      {
        name: "Twilio SMS",
        status: twilioCheck.connected ? "operational" as const : "not_configured" as const,
        latency: null,
        details: twilioCheck.details,
      },
      {
        name: "Resend Email",
        status: resendCheck.connected ? "operational" as const : "not_configured" as const,
        latency: null,
        details: resendCheck.details,
      },
      {
        name: "RevenueCat Payments",
        status: revenuecatCheck.connected ? "operational" as const : "not_configured" as const,
        latency: null,
        details: revenuecatCheck.details,
      },
      {
        name: "Anthropic AI (Claude)",
        status: process.env.ANTHROPIC_API_KEY ? "operational" as const : "not_configured" as const,
        latency: null,
        details: process.env.ANTHROPIC_API_KEY ? "claude-haiku-4-5" : "Not configured",
      },
    ];

    const uptime = process.uptime();

    res.json({
      services,
      uptime,
      environment: process.env.NODE_ENV || "development",
      version: "0.1.0-alpha",
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/ops/test-sms", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || typeof phoneNumber !== "string") {
      res.status(400).json({ error: "Phone number is required (e.g. +1XXXXXXXXXX)" });
      return;
    }

    const cleaned = phoneNumber.replace(/[^\d+]/g, "");
    if (!/^\+\d{10,15}$/.test(cleaned)) {
      res.status(400).json({ error: "Invalid phone number format. Use international format: +1XXXXXXXXXX" });
      return;
    }

    const result = await sendTestSMS(cleaned);

    if (result.success) {
      res.json({ success: true, message: `Test SMS sent to ${cleaned}` });
    } else {
      res.status(400).json({ error: result.error || "Failed to send SMS. Check Twilio configuration." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send test SMS" });
  }
});

export default router;
