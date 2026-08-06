import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

/**
 * Evergreen demo data: the demo dataset (seeded via /admin/ops/seed-demo)
 * is generated with timestamps relative to the seed time. As real time
 * passes, every time-windowed dashboard metric (last 24h / 7d / 30d)
 * drains to zero and the admin dashboard looks empty.
 *
 * This module rolls demo timestamps forward when they drift stale.
 *
 * Safety properties:
 * - Runs as ONE atomic PL/pgSQL block inside a single transaction, so a
 *   failure can never leave cross-table timestamps half-shifted.
 * - Serialized across all server instances (autoscale replicas, boot +
 *   interval + manual triggers) with a Postgres transaction-scoped
 *   advisory lock; concurrent runs skip instead of double-shifting.
 * - Staleness is measured ONLY from demo-owned messages, so live real
 *   traffic never masks stale demo data.
 * - Every per-user table is scoped to demo accounts (demo parents by
 *   `%@demo.tether.app` email + their children). Real users' rows are
 *   never touched.
 * - Aggregate/seed-only tables without ownership (keyword trends, safety
 *   analytics, demographic snapshots, interest graph, anomalies, events,
 *   sessions) use a past-only guard (`col + shift <= now()`) so recent
 *   real rows are never rewritten or pushed into the future.
 */

let refreshLock = false;

// Refresh when demo data is >24h stale; after refresh the newest demo
// message lands ~2h in the past.
const REFRESH_SQL = sql`
DO $$
DECLARE
  demo_count int;
  shift_sec bigint;
BEGIN
  -- Serialize across instances; if another refresh is running, skip.
  IF NOT pg_try_advisory_xact_lock(728394201) THEN
    RETURN;
  END IF;

  SELECT count(*) INTO demo_count FROM users WHERE email LIKE '%@demo.tether.app';
  IF demo_count <= 100 THEN
    RETURN; -- no demo dataset loaded; never touch a real-only database
  END IF;

  CREATE TEMP TABLE tmp_demo_users ON COMMIT DROP AS
    SELECT id FROM users WHERE email LIKE '%@demo.tether.app'
    UNION
    SELECT c.id FROM users c
      JOIN users p ON c.parent_id = p.id
      WHERE p.email LIKE '%@demo.tether.app';

  -- Staleness measured from demo-owned messages only.
  SELECT EXTRACT(EPOCH FROM (now() - interval '2 hours' - max(m.created_at)))::bigint
    INTO shift_sec
    FROM messages m
    JOIN tmp_demo_users du ON m.sender_id = du.id;

  IF shift_sec IS NULL OR shift_sec < 79200 THEN
    RETURN; -- fresher than ~24h total drift; nothing to do
  END IF;

  -- Core messaging data (demo-owned only)
  UPDATE messages SET created_at = created_at + shift_sec * interval '1 second'
    WHERE sender_id IN (SELECT id FROM tmp_demo_users);
  UPDATE conversations SET
      created_at = created_at + shift_sec * interval '1 second',
      last_message_at = CASE WHEN last_message_at IS NULL THEN NULL
        ELSE LEAST(last_message_at + shift_sec * interval '1 second', now()) END
    WHERE child_id IN (SELECT id FROM tmp_demo_users);
  UPDATE contacts SET created_at = created_at + shift_sec * interval '1 second'
    WHERE child_id IN (SELECT id FROM tmp_demo_users);
  UPDATE alerts SET created_at = created_at + shift_sec * interval '1 second'
    WHERE child_id IN (SELECT id FROM tmp_demo_users);
  UPDATE users SET created_at = LEAST(created_at + shift_sec * interval '1 second', now())
    WHERE id IN (SELECT id FROM tmp_demo_users);

  -- Per-user analytics (demo-owned only)
  UPDATE message_analytics SET created_at = created_at + shift_sec * interval '1 second'
    WHERE sender_id IN (SELECT id FROM tmp_demo_users);
  UPDATE conversation_insights SET analyzed_at = LEAST(analyzed_at + shift_sec * interval '1 second', now())
    WHERE conversation_id IN (SELECT id FROM conversations WHERE child_id IN (SELECT id FROM tmp_demo_users));
  UPDATE behavioral_metrics SET period_date = period_date + shift_sec * interval '1 second'
    WHERE user_id IN (SELECT id FROM tmp_demo_users);
  UPDATE network_graph SET period_date = period_date + shift_sec * interval '1 second'
    WHERE user_id IN (SELECT id FROM tmp_demo_users);
  UPDATE churn_predictions SET
      computed_at = LEAST(computed_at + shift_sec * interval '1 second', now()),
      last_active_at = last_active_at + shift_sec * interval '1 second',
      predicted_churn_date = predicted_churn_date + shift_sec * interval '1 second'
    WHERE user_id IN (SELECT id FROM tmp_demo_users);

  -- Aggregate / seed-only tables (no ownership column). Past-only guard
  -- keeps genuinely recent real rows untouched and never future-dates.
  UPDATE keyword_trends SET
      period_start = period_start + shift_sec * interval '1 second',
      period_end = period_end + shift_sec * interval '1 second'
    WHERE period_end + shift_sec * interval '1 second' <= now();
  UPDATE safety_analytics SET
      period_start = period_start + shift_sec * interval '1 second',
      period_end = period_end + shift_sec * interval '1 second'
    WHERE period_end + shift_sec * interval '1 second' <= now();
  UPDATE demographic_snapshots SET snapshot_date = snapshot_date + shift_sec * interval '1 second'
    WHERE snapshot_date + shift_sec * interval '1 second' <= now();
  UPDATE interest_graph SET period_date = period_date + shift_sec * interval '1 second'
    WHERE period_date + shift_sec * interval '1 second' <= now();
  UPDATE temporal_anomalies SET detected_at = detected_at + shift_sec * interval '1 second'
    WHERE detected_at + shift_sec * interval '1 second' <= now();
  UPDATE analytics_events SET created_at = created_at + shift_sec * interval '1 second'
    WHERE created_at + shift_sec * interval '1 second' <= now();
  UPDATE session_tracking SET
      started_at = started_at + shift_sec * interval '1 second',
      ended_at = ended_at + shift_sec * interval '1 second'
    WHERE ended_at IS NOT NULL AND ended_at + shift_sec * interval '1 second' <= now();
  UPDATE session_tracking SET started_at = started_at + shift_sec * interval '1 second'
    WHERE ended_at IS NULL AND started_at + shift_sec * interval '1 second' <= now();
  UPDATE waitlist SET created_at = created_at + shift_sec * interval '1 second'
    WHERE email LIKE '%@example.com'
      AND created_at + shift_sec * interval '1 second' <= now();
END $$;
`;

async function getDemoDriftHours(): Promise<number | null> {
  const res = await db.execute(sql`
    SELECT EXTRACT(EPOCH FROM (now() - max(m.created_at)))::bigint AS drift_sec
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN users p ON u.parent_id = p.id
    WHERE u.email LIKE '%@demo.tether.app' OR p.email LIKE '%@demo.tether.app'
  `);
  const driftSec = (res.rows[0] as any)?.drift_sec;
  return driftSec == null ? null : Number(driftSec) / 3600;
}

export async function refreshDemoTimestampsIfStale(): Promise<{
  refreshed: boolean;
  reason: string;
  driftHoursBefore?: number | null;
  driftHoursAfter?: number | null;
}> {
  if (refreshLock) return { refreshed: false, reason: "refresh already in progress" };
  refreshLock = true;
  try {
    const before = await getDemoDriftHours();
    if (before == null) return { refreshed: false, reason: "no demo dataset loaded" };
    if (before < 24) {
      return { refreshed: false, reason: "demo data is fresh", driftHoursBefore: before };
    }

    const started = Date.now();
    logger.info({ driftHours: before.toFixed(1) }, "[DemoRefresh] Rolling demo timestamps forward");
    await db.execute(REFRESH_SQL);
    const after = await getDemoDriftHours();
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    const refreshed = after != null && after < before - 1;
    logger.info(
      { elapsed, driftHoursBefore: before.toFixed(1), driftHoursAfter: after?.toFixed(1) },
      refreshed ? "[DemoRefresh] Demo timestamps refreshed" : "[DemoRefresh] Skipped (another instance refreshing, or below threshold)",
    );
    return {
      refreshed,
      reason: refreshed ? `shifted forward ${before.toFixed(1)}h` : "skipped by database-side guard",
      driftHoursBefore: before,
      driftHoursAfter: after,
    };
  } catch (err) {
    logger.error({ err }, "[DemoRefresh] Failed to refresh demo timestamps");
    return { refreshed: false, reason: "error during refresh" };
  } finally {
    refreshLock = false;
  }
}

const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function startDemoRefreshSchedule() {
  // Run shortly after boot (don't block startup), then periodically.
  setTimeout(() => {
    refreshDemoTimestampsIfStale().catch(() => {});
  }, 5_000);
  const timer = setInterval(() => {
    refreshDemoTimestampsIfStale().catch(() => {});
  }, REFRESH_INTERVAL_MS);
  timer.unref?.();
}
