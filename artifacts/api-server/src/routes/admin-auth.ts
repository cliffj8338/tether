import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifyFirebaseToken } from "../lib/firebase-admin";

const router: IRouter = Router();

router.post("/admin/auth/verify", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ error: "idToken is required" });
      return;
    }

    const decoded = await verifyFirebaseToken(idToken);
    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    let [user] = await db.select().from(usersTable).where(eq(usersTable.firebaseUid, decoded.uid));

    if (!user) {
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      const isAdmin = adminEmails.includes(decoded.email?.toLowerCase() || "");

      [user] = await db.insert(usersTable).values({
        firebaseUid: decoded.uid,
        email: decoded.email || null,
        displayName: decoded.name || decoded.email?.split("@")[0] || "Admin User",
        role: "parent",
        isAdmin,
      }).returning();
    }

    if (!user.isAdmin && user.role !== "parent") {
      res.status(403).json({ error: "Access denied. You are not authorized to access the admin dashboard." });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        isAdmin: user.isAdmin,
        avatarColor: user.avatarColor,
      },
      authorized: true,
    });
  } catch (error) {
    req.log.error(error, "Admin auth verification failed");
    res.status(500).json({ error: "Authentication failed" });
  }
});

export default router;
