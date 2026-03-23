import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, conversationsTable, usersTable, alertsTable } from "@workspace/db";
import { eq, desc, asc, lt, and } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";
import { scanContent } from "../lib/content-filter";
import { aiScanContent } from "../lib/ai-content-filter";
import { sendPushNotification, buildAlertPushMessage } from "../lib/push-notifications";

const router: IRouter = Router();

router.get("/conversations/:conversationId/messages", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const conversationId = parseInt(req.params.conversationId);
    const limit = parseInt(req.query.limit as string) || 50;
    const before = req.query.before ? parseInt(req.query.before as string) : undefined;

    let query = db.select().from(messagesTable).where(
      before
        ? and(eq(messagesTable.conversationId, conversationId), lt(messagesTable.id, before))
        : eq(messagesTable.conversationId, conversationId)
    ).orderBy(asc(messagesTable.createdAt)).limit(limit);

    const messages = await query;

    const result = await Promise.all(messages.map(async (m) => {
      const [sender] = await db.select().from(usersTable).where(eq(usersTable.id, m.senderId));
      return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: sender?.displayName ?? "Unknown",
        content: m.content,
        alertLevel: m.alertLevel ?? "none",
        flagReason: m.flagReason,
        isBlocked: m.isBlocked ?? false,
        isDelivered: m.isDelivered ?? true,
        createdAt: m.createdAt.toISOString(),
        isMine: m.senderId === user.id,
      };
    }));

    res.json(result);
  } catch (error) {
    req.log.error(error, "Failed to get messages");
    res.status(500).json({ error: "Failed to get messages" });
  }
});

router.post("/conversations/:conversationId/messages", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const conversationId = parseInt(req.params.conversationId);
    const { content } = req.body;
    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "content is required" });
      return;
    }

    const senderId = user.id;
    const patternResult = scanContent(content);

    const levelOrder: Record<string, number> = {
      none: 0, level1: 1, level2: 2, level3: 3, level4: 4, level5: 5,
    };

    let finalResult = patternResult;

    if (user.role === "child") {
      const [convoForFaith] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, conversationId));
      let faithMode = false;
      if (convoForFaith) {
        const [childUser] = await db.select().from(usersTable).where(eq(usersTable.id, convoForFaith.childId));
        faithMode = childUser?.faithModeEnabled ?? false;
      }

      const aiResult = await aiScanContent(content, faithMode);

      const patternLevel = levelOrder[patternResult.alertLevel] ?? 0;
      const aiLevel = levelOrder[aiResult.alertLevel] ?? 0;
      finalResult = aiLevel > patternLevel ? aiResult : patternResult;
    }

    const [message] = await db.insert(messagesTable).values({
      conversationId,
      senderId,
      content,
      alertLevel: finalResult.alertLevel,
      flagReason: finalResult.reason,
      isBlocked: finalResult.alertLevel === "level5",
      isDelivered: finalResult.alertLevel !== "level5",
    }).returning();

    await db.update(conversationsTable).set({
      lastMessagePreview: finalResult.alertLevel === "level5" ? "[Message blocked]" : content,
      lastMessageAt: new Date(),
    }).where(eq(conversationsTable.id, conversationId));

    if (finalResult.alertLevel !== "none") {
      const [convo] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, conversationId));
      if (convo) {
        const [child] = await db.select().from(usersTable).where(eq(usersTable.id, convo.childId));
        if (child?.parentId) {
          const [alert] = await db.insert(alertsTable).values({
            parentId: child.parentId,
            childId: convo.childId,
            messageId: message.id,
            alertLevel: finalResult.alertLevel,
            title: finalResult.title,
            description: finalResult.reason,
          }).returning();

          const [parent] = await db.select().from(usersTable).where(eq(usersTable.id, child.parentId));
          if (parent?.pushToken) {
            const { pushTitle, pushBody } = buildAlertPushMessage(
              finalResult.alertLevel,
              child.displayName,
              finalResult.title,
              finalResult.reason
            );
            sendPushNotification(parent.pushToken, pushTitle, pushBody, {
              type: "alert",
              alertId: alert.id,
              alertLevel: finalResult.alertLevel,
              childId: convo.childId,
            }).catch(() => {});
          }
        }
      }
    }

    res.status(201).json({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: user.displayName,
      content: message.content,
      alertLevel: message.alertLevel ?? "none",
      flagReason: message.flagReason,
      isBlocked: message.isBlocked ?? false,
      isDelivered: message.isDelivered ?? true,
      createdAt: message.createdAt.toISOString(),
      isMine: true,
    });
  } catch (error) {
    req.log.error(error, "Failed to send message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
