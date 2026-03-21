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

    let convos;
    if (req.query.childId) {
      const childId = parseInt(req.query.childId as string);
      convos = await db.select().from(conversationsTable).where(
        eq(conversationsTable.childId, childId)
      );
    } else if (user.role === "child") {
      convos = await db.select().from(conversationsTable).where(
        eq(conversationsTable.childId, user.id)
      );
    } else {
      const children = await db.select({ id: usersTable.id }).from(usersTable).where(
        eq(usersTable.parentId, user.id)
      );
      const childIds = children.map(c => c.id);
      if (childIds.length === 0) {
        res.json([]);
        return;
      }
      const allConvos = [];
      for (const cid of childIds) {
        const c = await db.select().from(conversationsTable).where(eq(conversationsTable.childId, cid));
        allConvos.push(...c);
      }
      convos = allConvos;
    }

    const result = await Promise.all(convos.map(async (c) => {
      const [contact] = await db.select().from(contactsTable).where(eq(contactsTable.id, c.contactId));
      return {
        id: c.id,
        childId: c.childId,
        contactId: c.contactId,
        contactName: contact?.contactName ?? "Unknown",
        contactAvatarColor: contact?.avatarColor ?? "#7B8EC4",
        lastMessage: c.lastMessagePreview ?? "",
        lastMessageTime: c.lastMessageAt ? formatTimeAgo(c.lastMessageAt) : "",
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

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default router;
