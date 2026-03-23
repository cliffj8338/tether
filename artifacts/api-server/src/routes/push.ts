import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.post("/push-token", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { token } = req.body;
    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "token is required" });
      return;
    }

    await db
      .update(usersTable)
      .set({ pushToken: token })
      .where(eq(usersTable.id, user.id));

    res.json({ success: true });
  } catch (error) {
    req.log.error(error, "Failed to register push token");
    res.status(500).json({ error: "Failed to register push token" });
  }
});

router.delete("/push-token", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await db
      .update(usersTable)
      .set({ pushToken: null })
      .where(eq(usersTable.id, user.id));

    res.json({ success: true });
  } catch (error) {
    req.log.error(error, "Failed to remove push token");
    res.status(500).json({ error: "Failed to remove push token" });
  }
});

export default router;
