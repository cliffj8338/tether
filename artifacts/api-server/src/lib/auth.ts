import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Request } from "express";

export async function getUserFromToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const parts = token.split(".");
  const userId = parseInt(parts[parts.length - 1]);
  if (isNaN(userId)) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user ?? null;
}
