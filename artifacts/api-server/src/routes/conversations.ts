import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversationsTable, contactsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.get("/conversations", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const childId = parseInt(req.query.childId as string);
    if (isNaN(childId)) {
      res.status(400).json({ error: "childId is required" });
      return;
    }

    const convos = await db.select().from(conversationsTable).where(
      eq(conversationsTable.childId, childId)
    );

    const result = await Promise.all(convos.map(async (c) => {
      const [contact] = await db.select().from(contactsTable).where(eq(contactsTable.id, c.contactId));
      return {
        id: c.id,
        childId: c.childId,
        contactId: c.contactId,
        contactName: contact?.contactName ?? "Unknown",
        contactAvatarColor: "#7B8EC4",
        lastMessagePreview: c.lastMessagePreview,
        lastMessageAt: c.lastMessageAt?.toISOString() ?? null,
        unreadCount: c.unreadCount ?? 0,
        isPaused: c.isPaused ?? false,
      };
    }));

    res.json(result);
  } catch (error) {
    req.log.error(error, "Failed to get conversations");
    res.status(500).json({ error: "Failed to get conversations" });
  }
});

export default router;
