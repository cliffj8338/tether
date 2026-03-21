import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable, conversationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RequestContactBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.get("/contacts", async (req, res) => {
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

    const contacts = await db.select().from(contactsTable).where(eq(contactsTable.childId, childId));
    res.json(contacts.map(c => ({
      id: c.id,
      childId: c.childId,
      contactChildId: c.contactChildId,
      contactName: c.contactName,
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
      approvedByParent: false,
      parentIntroSent: false,
    }).returning();

    res.status(201).json({
      id: contact.id,
      childId: contact.childId,
      contactChildId: contact.contactChildId,
      contactName: contact.contactName,
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
