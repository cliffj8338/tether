import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { alertsTable, usersTable, messagesTable, conversationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.get("/alerts", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const childId = req.query.childId ? parseInt(req.query.childId as string) : undefined;

    const alerts = childId
      ? await db.select().from(alertsTable).where(
          and(eq(alertsTable.parentId, user.id), eq(alertsTable.childId, childId))
        ).orderBy(desc(alertsTable.createdAt))
      : await db.select().from(alertsTable).where(
          eq(alertsTable.parentId, user.id)
        ).orderBy(desc(alertsTable.createdAt));

    const result = await Promise.all(alerts.map(async (a) => {
      const [child] = await db.select().from(usersTable).where(eq(usersTable.id, a.childId));
      let messagePreview = "";
      let conversationId: number | null = null;
      if (a.messageId) {
        const [msg] = await db.select().from(messagesTable).where(eq(messagesTable.id, a.messageId));
        if (msg) {
          messagePreview = msg.isBlocked ? "[Message blocked]" : msg.content;
          conversationId = msg.conversationId;
        }
      }
      const diff = Date.now() - a.createdAt.getTime();
      const mins = Math.floor(diff / 60000);
      let time = "Just now";
      if (mins >= 60 * 24) time = `${Math.floor(mins / (60 * 24))}d ago`;
      else if (mins >= 60) time = `${Math.floor(mins / 60)}h ago`;
      else if (mins >= 1) time = `${mins}m ago`;

      return {
        id: a.id,
        parentId: a.parentId,
        childId: a.childId,
        childName: child?.displayName ?? "Unknown",
        messageId: a.messageId,
        alertLevel: a.alertLevel,
        title: a.title,
        description: a.description ?? "",
        messagePreview,
        isRead: a.isRead ?? false,
        createdAt: a.createdAt.toISOString(),
        time,
        conversationId,
      };
    }));

    res.json(result);
  } catch (error) {
    req.log.error(error, "Failed to get alerts");
    res.status(500).json({ error: "Failed to get alerts" });
  }
});

router.post("/alerts/:alertId/read", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const alertId = parseInt(req.params.alertId);
    const [alert] = await db.update(alertsTable).set({
      isRead: true,
    }).where(
      and(eq(alertsTable.id, alertId), eq(alertsTable.parentId, user.id))
    ).returning();

    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    const [child] = await db.select().from(usersTable).where(eq(usersTable.id, alert.childId));

    res.json({
      id: alert.id,
      parentId: alert.parentId,
      childId: alert.childId,
      childName: child?.displayName ?? "Unknown",
      messageId: alert.messageId,
      alertLevel: alert.alertLevel,
      title: alert.title,
      description: alert.description,
      isRead: true,
      createdAt: alert.createdAt.toISOString(),
    });
  } catch (error) {
    req.log.error(error, "Failed to mark alert read");
    res.status(500).json({ error: "Failed to mark alert read" });
  }
});

export default router;
