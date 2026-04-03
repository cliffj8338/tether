import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { platformCostsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin, blockShowcaseWrites } from "../lib/require-admin";

const router: IRouter = Router();

router.get("/platform-costs", async (_req, res) => {
  try {
    const costs = await db
      .select()
      .from(platformCostsTable)
      .orderBy(desc(platformCostsTable.month), platformCostsTable.category);

    const byMonth: Record<string, { month: string; total: number; categories: Record<string, number>; entries: typeof costs }> = {};
    for (const c of costs) {
      if (!byMonth[c.month]) {
        byMonth[c.month] = { month: c.month, total: 0, categories: {}, entries: [] };
      }
      const amt = parseFloat(c.amount);
      byMonth[c.month].total += amt;
      byMonth[c.month].categories[c.category] = (byMonth[c.month].categories[c.category] || 0) + amt;
      byMonth[c.month].entries.push(c);
    }

    const months = Object.values(byMonth).sort((a, b) => b.month.localeCompare(a.month));

    res.json({
      months,
      grandTotal: costs.reduce((s, c) => s + parseFloat(c.amount), 0),
      lastUpdated: costs.length > 0 ? costs[0].updatedAt : null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use("/admin/ops/costs", requireAdmin, blockShowcaseWrites);

router.get("/admin/ops/costs", async (_req, res) => {
  try {
    const costs = await db
      .select()
      .from(platformCostsTable)
      .orderBy(desc(platformCostsTable.month), platformCostsTable.category);
    res.json({ costs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/ops/costs", async (req, res) => {
  try {
    const { month, category, amount, notes } = req.body;
    if (!month || !category || amount == null) {
      return res.status(400).json({ error: "month, category, and amount are required" });
    }
    const [entry] = await db.insert(platformCostsTable).values({
      month,
      category,
      amount: String(amount),
      notes: notes || null,
    }).returning();
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/admin/ops/costs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { month, category, amount, notes } = req.body;
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (month) updates.month = month;
    if (category) updates.category = category;
    if (amount != null) updates.amount = String(amount);
    if (notes !== undefined) updates.notes = notes || null;

    const [entry] = await db.update(platformCostsTable)
      .set(updates)
      .where(eq(platformCostsTable.id, id))
      .returning();
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/ops/costs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [entry] = await db.delete(platformCostsTable)
      .where(eq(platformCostsTable.id, id))
      .returning();
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
