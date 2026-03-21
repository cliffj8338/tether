import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, conversationsTable, usersTable, alertsTable } from "@workspace/db";
import { eq, desc, asc, lt, and } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";
import { scanContent } from "../lib/content-filter";

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
    const scanResult = scanContent(content);

    const [message] = await db.insert(messagesTable).values({
      conversationId,
      senderId,
      content,
      alertLevel: scanResult.alertLevel,
      flagReason: scanResult.reason,
      isBlocked: scanResult.alertLevel === "level5",
      isDelivered: scanResult.alertLevel !== "level5",
    }).returning();

    await db.update(conversationsTable).set({
      lastMessagePreview: scanResult.alertLevel === "level5" ? "[Message blocked]" : content,
      lastMessageAt: new Date(),
    }).where(eq(conversationsTable.id, conversationId));

    if (scanResult.alertLevel !== "none") {
      const [convo] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, conversationId));
      if (convo) {
        const [child] = await db.select().from(usersTable).where(eq(usersTable.id, convo.childId));
        if (child?.parentId) {
          await db.insert(alertsTable).values({
            parentId: child.parentId,
            childId: convo.childId,
            messageId: message.id,
            alertLevel: scanResult.alertLevel,
            title: scanResult.title,
            description: scanResult.reason,
          });
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
