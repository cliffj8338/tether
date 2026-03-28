import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Request } from "express";

export async function getUserFromToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token || token.length < 10) return null;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.passwordHash, token));
  return user ?? null;
}
