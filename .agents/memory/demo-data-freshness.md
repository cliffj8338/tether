---
name: Demo data freshness
description: Why the admin dashboard can look empty despite a fully seeded production DB, and how the evergreen refresh works.
---

The demo seeder generates all timestamps relative to seed time. Weeks later, every time-windowed metric (24h/7d/30d) reads zero — the dashboard looks like the data is "missing" even though totals are intact.

**Rule:** if the admin dashboard looks empty on production, check timestamp drift before assuming missing data (`SELECT now() - max(created_at) FROM messages` on prod, read-only).

**Why:** happened Aug 2026 — prod had 1,480 users / 8,197 messages seeded in March; all rolling-window metrics were zero.

**How to apply:** the evergreen fix lives in the API server's demo-refresh module — an atomic PL/pgSQL block behind a Postgres advisory lock, scoped to demo-owned rows (`%@demo.tether.app`), run at boot + every 6h + manual admin endpoint. Any new seeded table with a timestamp column must be added to that block or it will go stale independently.
