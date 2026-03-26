import { Router, type IRouter } from "express";
import { db, analyticsEventsTable, sessionTrackingTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "tether-salt").digest("hex").slice(0, 16);
}

router.post("/analytics/events", async (req, res) => {
  try {
    const { source, eventName, sessionId, userId, metadata, pageUrl, referrer } = req.body;

    if (!source || !eventName) {
      res.status(400).json({ error: "source and eventName are required" });
      return;
    }

    const userAgent = req.headers["user-agent"] ?? null;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "";
    const ipHash = hashIp(ip);

    await db.insert(analyticsEventsTable).values({
      source,
      eventName,
      sessionId: sessionId ?? null,
      userId: userId ?? null,
      metadata: metadata ?? null,
      pageUrl: pageUrl ?? null,
      referrer: referrer ?? null,
      userAgent,
      ipHash,
    });

    if (sessionId) {
      const existing = await db.select().from(sessionTrackingTable).where(eq(sessionTrackingTable.sessionId, sessionId));
      if (existing.length > 0) {
        const updates: Record<string, unknown> = {
          eventsCount: (existing[0].eventsCount ?? 0) + 1,
          endedAt: new Date(),
          durationSeconds: Math.floor((Date.now() - existing[0].startedAt.getTime()) / 1000),
        };
        if (eventName === "page_view" || eventName === "screen_view") {
          updates.pagesViewed = (existing[0].pagesViewed ?? 0) + 1;
        }
        await db.update(sessionTrackingTable).set(updates).where(eq(sessionTrackingTable.sessionId, sessionId));
      }
    }

    res.status(201).json({ ok: true });
  } catch (error) {
    req.log.error(error, "Failed to record analytics event");
    res.status(500).json({ error: "Failed to record event" });
  }
});

router.post("/analytics/sessions", async (req, res) => {
  try {
    const { sessionId, source, userId, deviceType, platform, screenResolution, appVersion } = req.body;

    if (!sessionId || !source) {
      res.status(400).json({ error: "sessionId and source are required" });
      return;
    }

    const existing = await db.select().from(sessionTrackingTable).where(eq(sessionTrackingTable.sessionId, sessionId));

    if (existing.length > 0) {
      await db.update(sessionTrackingTable).set({
        endedAt: new Date(),
        durationSeconds: Math.floor((Date.now() - existing[0].startedAt.getTime()) / 1000),
      }).where(eq(sessionTrackingTable.sessionId, sessionId));
    } else {
      await db.insert(sessionTrackingTable).values({
        sessionId,
        source,
        userId: userId ?? null,
        deviceType: deviceType ?? null,
        platform: platform ?? null,
        screenResolution: screenResolution ?? null,
        appVersion: appVersion ?? null,
      });
    }

    res.status(201).json({ ok: true });
  } catch (error) {
    req.log.error(error, "Failed to record session");
    res.status(500).json({ error: "Failed to record session" });
  }
});

export default router;
