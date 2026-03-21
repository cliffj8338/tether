import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, messagesTable, alertsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { AddChildBody, UpdateChildBody, UpdateTrustLevelBody } from "@workspace/api-zod";
import { getUserFromToken } from "../lib/auth";

const router: IRouter = Router();

router.get("/children", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const children = await db.select().from(usersTable).where(
      and(eq(usersTable.parentId, user.id), eq(usersTable.role, "child"))
    );

    const result = await Promise.all(children.map(async (child) => {
      const [flagResult] = await db.select({
        count: sql<number>`count(*)::int`,
      }).from(alertsTable).where(eq(alertsTable.childId, child.id));

      const [msgResult] = await db.select({
        count: sql<number>`count(*)::int`,
      }).from(messagesTable).where(eq(messagesTable.senderId, child.id));

      return {
        id: child.id,
        displayName: child.displayName,
        avatarColor: child.avatarColor,
        grade: child.grade,
        age: child.age,
        trustLevel: child.trustLevel ?? 1,
        faithModeEnabled: child.faithModeEnabled ?? false,
        isPaused: child.isPaused ?? false,
        flagCount: flagResult?.count ?? 0,
        messageCount: msgResult?.count ?? 0,
      };
    }));

    res.json(result);
  } catch (error) {
    req.log.error(error, "Failed to get children");
    res.status(500).json({ error: "Failed to get children" });
  }
});

router.post("/children", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const body = AddChildBody.parse(req.body);
    const [child] = await db.insert(usersTable).values({
      displayName: body.displayName,
      role: "child",
      parentId: user.id,
      pin: body.pin,
      grade: body.grade,
      age: body.age,
      avatarColor: body.avatarColor ?? "#7B8EC4",
    }).returning();

    res.status(201).json({
      id: child.id,
      displayName: child.displayName,
      avatarColor: child.avatarColor,
      grade: child.grade,
      age: child.age,
      trustLevel: child.trustLevel ?? 1,
      faithModeEnabled: child.faithModeEnabled ?? false,
      isPaused: child.isPaused ?? false,
      flagCount: 0,
      messageCount: 0,
    });
  } catch (error) {
    req.log.error(error, "Failed to add child");
    res.status(500).json({ error: "Failed to add child" });
  }
});

router.patch("/children/:childId", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const childId = parseInt(req.params.childId);
    const body = UpdateChildBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.grade !== undefined) updateData.grade = body.grade;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.trustLevel !== undefined) updateData.trustLevel = body.trustLevel;
    if (body.faithModeEnabled !== undefined) updateData.faithModeEnabled = body.faithModeEnabled;
    if (body.isPaused !== undefined) updateData.isPaused = body.isPaused;
    if (body.avatarColor !== undefined) updateData.avatarColor = body.avatarColor;

    const [child] = await db.update(usersTable).set(updateData).where(
      and(eq(usersTable.id, childId), eq(usersTable.parentId, user.id))
    ).returning();

    if (!child) {
      res.status(404).json({ error: "Child not found" });
      return;
    }

    res.json({
      id: child.id,
      displayName: child.displayName,
      avatarColor: child.avatarColor,
      grade: child.grade,
      age: child.age,
      trustLevel: child.trustLevel ?? 1,
      faithModeEnabled: child.faithModeEnabled ?? false,
      isPaused: child.isPaused ?? false,
    });
  } catch (error) {
    req.log.error(error, "Failed to update child");
    res.status(500).json({ error: "Failed to update child" });
  }
});

router.patch("/children/:childId/trust-level", async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "parent") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const childId = parseInt(req.params.childId);
    const body = UpdateTrustLevelBody.parse(req.body);

    const [child] = await db.update(usersTable).set({
      trustLevel: body.trustLevel,
    }).where(
      and(eq(usersTable.id, childId), eq(usersTable.parentId, user.id))
    ).returning();

    if (!child) {
      res.status(404).json({ error: "Child not found" });
      return;
    }

    res.json({
      id: child.id,
      displayName: child.displayName,
      avatarColor: child.avatarColor,
      grade: child.grade,
      age: child.age,
      trustLevel: child.trustLevel ?? 1,
      faithModeEnabled: child.faithModeEnabled ?? false,
      isPaused: child.isPaused ?? false,
    });
  } catch (error) {
    req.log.error(error, "Failed to update trust level");
    res.status(500).json({ error: "Failed to update trust level" });
  }
});

export default router;
