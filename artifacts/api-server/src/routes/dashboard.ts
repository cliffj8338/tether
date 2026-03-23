import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, messagesTable, alertsTable, contactsTable, conversationsTable } from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const children = await db.select({ id: usersTable.id }).from(usersTable).where(
      and(eq(usersTable.parentId, user.id), eq(usersTable.role, "child"))
    );
    const childIds = children.map(c => c.id);

    let totalMessages = 0;
    let flaggedMessages = 0;
    let activeContacts = 0;
    let unreadAlerts = 0;

    if (childIds.length > 0) {
      for (const childId of childIds) {
        const [msgCount] = await db.select({
          count: sql<number>`count(*)::int`,
        }).from(messagesTable).where(eq(messagesTable.senderId, childId));
        totalMessages += msgCount?.count ?? 0;

        const [flagCount] = await db.select({
          count: sql<number>`count(*)::int`,
        }).from(alertsTable).where(eq(alertsTable.childId, childId));
        flaggedMessages += flagCount?.count ?? 0;

        const [contactCount] = await db.select({
          count: sql<number>`count(*)::int`,
        }).from(contactsTable).where(eq(contactsTable.childId, childId));
        activeContacts += contactCount?.count ?? 0;
      }

      const [alertCount] = await db.select({
        count: sql<number>`count(*)::int`,
      }).from(alertsTable).where(
        and(eq(alertsTable.parentId, user.id), eq(alertsTable.isRead, false))
      );
      unreadAlerts = alertCount?.count ?? 0;
    }

    res.json({
      totalMessages,
      flaggedMessages,
      activeContacts,
      unreadAlerts,
    });
  } catch (error) {
    req.log.error(error, "Failed to get dashboard stats");
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});

router.get("/dashboard/feed", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const children = await db.select().from(usersTable).where(
      and(eq(usersTable.parentId, user.id), eq(usersTable.role, "child"))
    );
    const childIds = children.map(c => c.id);

    if (childIds.length === 0) {
      res.json([]);
      return;
    }

    const allMessages: Array<{
      id: number;
      type: string;
      childName: string;
      contactName: string;
      alertLevel: string;
      preview: string;
      time: string;
      childAvatarColor: string;
      _sortKey: number;
    }> = [];

    for (const child of children) {
      const convos = await db.select().from(conversationsTable).where(eq(conversationsTable.childId, child.id));
      for (const convo of convos) {
        const messages = await db.select().from(messagesTable).where(
          eq(messagesTable.conversationId, convo.id)
        ).orderBy(desc(messagesTable.createdAt)).limit(5);

        const [contact] = await db.select().from(contactsTable).where(eq(contactsTable.id, convo.contactId));

        for (const msg of messages) {
          const alertLabels: Record<string, string> = {
            none: "Conversation",
            level1: "Level 1 — Soft flag",
            level2: "Level 2 — Warning",
            level3: "Level 3 — Concern",
            level4: "Level 4 — High Priority",
            level5: "Level 5 — Critical",
          };
          const diff = Date.now() - msg.createdAt.getTime();
          const mins = Math.floor(diff / 60000);
          let timeAgo = "Just now";
          if (mins >= 60 * 24) timeAgo = `${Math.floor(mins / (60 * 24))}d ago`;
          else if (mins >= 60) timeAgo = `${Math.floor(mins / 60)}h ago`;
          else if (mins >= 1) timeAgo = `${mins}m ago`;

          allMessages.push({
            id: msg.id,
            type: msg.alertLevel !== "none" ? "alert" : "message",
            childName: child.displayName,
            contactName: contact?.contactName ?? "Unknown",
            alertLevel: msg.alertLevel ?? "none",
            preview: msg.isBlocked ? "[Message blocked]" : msg.content,
            time: timeAgo,
            childAvatarColor: child.avatarColor ?? "#7B8EC4",
            _sortKey: msg.createdAt.getTime(),
          });
        }
      }
    }

    allMessages.sort((a, b) => b._sortKey - a._sortKey);
    res.json(allMessages.slice(0, 20).map(({ _sortKey, ...rest }) => rest));
  } catch (error) {
    req.log.error(error, "Failed to get dashboard feed");
    res.status(500).json({ error: "Failed to get dashboard feed" });
  }
});

router.get("/users/me", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({
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
    });
  } catch (error) {
    req.log.error(error, "Failed to get current user");
    res.status(500).json({ error: "Failed to get current user" });
  }
});

router.patch("/users/me", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (typeof req.body.phone === "string") {
      updates.phone = req.body.phone || null;
    }
    if (typeof req.body.displayName === "string" && req.body.displayName.trim()) {
      updates.displayName = req.body.displayName.trim();
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, user.id))
      .returning();

    res.json({
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      role: updated.role,
      parentId: updated.parentId,
      avatarColor: updated.avatarColor,
      trustLevel: updated.trustLevel,
      faithModeEnabled: updated.faithModeEnabled,
      isPaused: updated.isPaused,
      phone: updated.phone,
    });
  } catch (error) {
    req.log.error(error, "Failed to update user");
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
