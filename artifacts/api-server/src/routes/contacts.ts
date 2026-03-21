import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable, conversationsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RequestContactBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";

const AVATAR_COLORS = ["#7B8EC4", "#6B9E8A", "#C49A3A", "#C4603A", "#A03030", "#7A6EA8", "#4E7D6A"];

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

const router: IRouter = Router();

router.get("/contacts", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let contacts;
    if (req.query.childId) {
      const childId = parseInt(req.query.childId as string);
      contacts = await db.select().from(contactsTable).where(eq(contactsTable.childId, childId));
    } else if (user.role === "child") {
      contacts = await db.select().from(contactsTable).where(eq(contactsTable.childId, user.id));
    } else {
      const children = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.parentId, user.id));
      const childIds = children.map(c => c.id);
      const allContacts = [];
      for (const cid of childIds) {
        const c = await db.select().from(contactsTable).where(eq(contactsTable.childId, cid));
        allContacts.push(...c);
      }
      contacts = allContacts;
    }

    res.json(contacts.map(c => ({
      id: c.id,
      childId: c.childId,
      contactChildId: c.contactChildId,
      contactName: c.contactName,
      avatarColor: c.avatarColor ?? "#7B8EC4",
      approvedByParent: c.approvedByParent ?? false,
      parentIntroSent: c.parentIntroSent ?? false,
      createdAt: c.createdAt.toISOString(),
    })));
  } catch (error) {
    req.log.error(error, "Failed to get contacts");
    res.status(500).json({ error: "Failed to get contacts" });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const body = RequestContactBody.parse(req.body);
    const [contact] = await db.insert(contactsTable).values({
      childId: body.childId,
      contactChildId: 0,
      contactName: body.contactName,
      avatarColor: randomAvatarColor(),
      approvedByParent: false,
      parentIntroSent: false,
    }).returning();

    res.status(201).json({
      id: contact.id,
      childId: contact.childId,
      contactChildId: contact.contactChildId,
      contactName: contact.contactName,
      avatarColor: contact.avatarColor,
      approvedByParent: contact.approvedByParent ?? false,
      parentIntroSent: contact.parentIntroSent ?? false,
      createdAt: contact.createdAt.toISOString(),
    });
  } catch (error) {
    req.log.error(error, "Failed to request contact");
    res.status(500).json({ error: "Failed to request contact" });
  }
});

router.post("/contacts/:contactId/approve", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const contactId = parseInt(req.params.contactId);
    const [contact] = await db.update(contactsTable).set({
      approvedByParent: true,
    }).where(eq(contactsTable.id, contactId)).returning();

    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    await db.insert(conversationsTable).values({
      childId: contact.childId,
      contactId: contact.id,
    });

    res.json({
      id: contact.id,
      childId: contact.childId,
      contactChildId: contact.contactChildId,
      contactName: contact.contactName,
      approvedByParent: true,
      parentIntroSent: contact.parentIntroSent ?? false,
      createdAt: contact.createdAt.toISOString(),
    });
  } catch (error) {
    req.log.error(error, "Failed to approve contact");
    res.status(500).json({ error: "Failed to approve contact" });
  }
});

export default router;
