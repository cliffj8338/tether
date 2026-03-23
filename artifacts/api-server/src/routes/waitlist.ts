import { Router } from "express";
import { db } from "@workspace/db";
import { waitlistTable, insertWaitlistSchema } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const router = Router();

router.post("/waitlist", async (req, res) => {
  try {
    const parsed = insertWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }

    const [entry] = await db.insert(waitlistTable).values(parsed.data).returning();
    res.status(201).json({ success: true, id: entry.id });
  } catch (err: any) {
    if (err?.constraint?.includes("email")) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    console.error("Waitlist signup error:", err);
    res.status(500).json({ error: "Failed to save signup" });
  }
});

router.get("/waitlist/count", async (_req, res) => {
  try {
    const [result] = await db.select({ total: count() }).from(waitlistTable);
    res.json({ count: result.total });
  } catch (err) {
    console.error("Waitlist count error:", err);
    res.status(500).json({ error: "Failed to get count" });
  }
});

export default router;
