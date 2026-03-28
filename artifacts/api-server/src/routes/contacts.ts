import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable, conversationsTable, usersTable } from "@workspace/db";
import { eq, and, like, or } from "drizzle-orm";
import { RequestContactBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";

const AVATAR_COLORS = ["#7B8EC4", "#6B9E8A", "#C49A3A", "#C4603A", "#A03030", "#7A6EA8", "#4E7D6A"];

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

async function getOwnedChildIds(parentId: number): Promise<Set<number>> {
  const children = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.parentId, parentId));
  return new Set(children.map(c => c.id));
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
      if (user.role === "parent") {
        const ownedIds = await getOwnedChildIds(user.id);
        if (!ownedIds.has(childId)) {
          res.status(403).json({ error: "Not your child" });
          return;
        }
      } else if (user.role === "child" && user.id !== childId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      contacts = await db.select().from(contactsTable).where(eq(contactsTable.childId, childId));
    } else if (user.role === "child") {
      contacts = await db.select().from(contactsTable).where(eq(contactsTable.childId, user.id));
    } else {
      const ownedIds = await getOwnedChildIds(user.id);
      const allContacts = [];
      for (const cid of ownedIds) {
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

router.get("/contacts/search", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const query = (req.query.q as string || "").trim();
    if (!query || query.length < 2) {
      res.json([]);
      return;
    }

    const results = await db.select({
      id: usersTable.id,
      displayName: usersTable.displayName,
      avatarColor: usersTable.avatarColor,
    }).from(usersTable).where(
      and(
        eq(usersTable.role, "child"),
        or(
          like(usersTable.displayName, `%${query}%`),
          like(usersTable.familyCode, `%${query}%`)
        )
      )
    );

    const ownedIds = await getOwnedChildIds(user.id);
    const filtered = results.filter(r => !ownedIds.has(r.id));

    res.json(filtered.map(r => ({
      id: r.id,
      displayName: r.displayName,
      avatarColor: r.avatarColor ?? "#7B8EC4",
    })));
  } catch (error) {
    req.log.error(error, "Failed to search contacts");
    res.status(500).json({ error: "Failed to search" });
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

    if (user.role === "parent") {
      const ownedIds = await getOwnedChildIds(user.id);
      if (!ownedIds.has(body.childId)) {
        res.status(403).json({ error: "Not your child" });
        return;
      }
    } else if (user.role === "child" && user.id !== body.childId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [contact] = await db.insert(contactsTable).values({
      childId: body.childId,
      contactChildId: body.contactChildId ?? null,
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

    const [existingContact] = await db.select().from(contactsTable).where(eq(contactsTable.id, contactId));
    if (!existingContact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    const ownedIds = await getOwnedChildIds(user.id);
    if (!ownedIds.has(existingContact.childId)) {
      res.status(403).json({ error: "Not your child's contact" });
      return;
    }

    const [contact] = await db.update(contactsTable).set({
      approvedByParent: true,
    }).where(eq(contactsTable.id, contactId)).returning();

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
