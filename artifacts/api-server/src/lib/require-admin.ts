import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifyFirebaseToken } from "./firebase-admin";
import { getUserFromToken } from "./auth";
import { getShowcaseToken } from "../routes/admin-auth";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers["x-admin-key"];
  if (process.env.ADMIN_API_KEY && adminKey === process.env.ADMIN_API_KEY) {
    next();
    return;
  }

  const showcaseToken = req.headers["x-showcase-token"] as string | undefined;
  if (showcaseToken && showcaseToken === getShowcaseToken()) {
    (req as any).isShowcase = true;
    (req as any).user = { id: -1, displayName: "Showcase Viewer", role: "viewer", isAdmin: false };
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    const decoded = await verifyFirebaseToken(token);
    if (decoded) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.firebaseUid, decoded.uid));
      if (user && user.isAdmin) {
        (req as any).user = user;
        next();
        return;
      }
      res.status(403).json({ error: "Access denied. Admin privileges required." });
      return;
    }

    const legacyUser = await getUserFromToken(req);
    if (legacyUser && legacyUser.isAdmin) {
      (req as any).user = legacyUser;
      next();
      return;
    }
  }

  res.status(401).json({ error: "Unauthorized" });
}

export function blockShowcaseWrites(req: Request, res: Response, next: NextFunction) {
  if ((req as any).isShowcase && req.method !== "GET") {
    res.status(403).json({ error: "Showcase mode is view-only. Write operations are not permitted." });
    return;
  }
  next();
}
