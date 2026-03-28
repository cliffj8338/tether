/**
 * commandCenterSync.ts
 *
 * Drop this file into your Tether admin source, e.g.:
 *   apps/admin/src/lib/commandCenterSync.ts
 *
 * Writes Tether project stats to the shared Build Control Firestore
 * (work-blueprint project), collection commandcenter/tether.
 * The command center dashboard reads this via real-time onSnapshot.
 *
 * Uses Firestore REST API — no extra SDK needed.
 *
 * USAGE in your admin Overview component:
 *
 *   import { syncCommandCenter } from '@/lib/commandCenterSync';
 *
 *   useEffect(() => {
 *     syncCommandCenter(currentUser?.email ?? 'admin');
 *   }, []);
 */

// Blueprint shared Firestore — command center lives here
const BLUEPRINT_PROJECT_ID = 'work-blueprint';
const BLUEPRINT_API_KEY    = 'AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE';
const FIRESTORE_BASE       =
  `https://firestore.googleapis.com/v1/projects/${BLUEPRINT_PROJECT_ID}/databases/(default)/documents`;

// ── Tether project stats ──────────────────────────────────────────────
// Update these as the project grows. lineCount/fileCount/featureCount
// are code-level facts — update per session. deploys = total Replit deploys.
const TETHER_STATS = {
  lineCount:    30800,
  fileCount:    184,
  version:      '—',
  featureCount: 40,
  deploys:      0,          // update this each session
  subApps: [
    { name: 'Admin Intelligence Dashboard', loc: 9879,  files: 86 },
    { name: 'Mobile App (Expo)',             loc: 6214,  files: 38 },
    { name: 'Marketing Website',             loc: 4172,  files: 30 },
    { name: 'API Server',                    loc: 3916,  files: 30 },
  ],
  roadmap: {
    total:      25,
    done:       12,
    inProgress: 0,
    planned:    13,
    deferred:   0,
  },
};

// ── Firestore REST helpers ────────────────────────────────────────────

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

function toFV(val: unknown): FirestoreValue {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean')          return { booleanValue: val };
  if (typeof val === 'number')
    return Number.isInteger(val)
      ? { integerValue: String(val) }
      : { doubleValue: val };
  if (typeof val === 'string')           return { stringValue: val };
  if (Array.isArray(val))
    return { arrayValue: { values: val.map(toFV) } };
  if (typeof val === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      fields[k] = toFV(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function buildBody(data: Record<string, unknown>): string {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFV(v);
  }
  return JSON.stringify({ fields });
}

// ── Main sync ─────────────────────────────────────────────────────────

/**
 * Writes Tether stats to commandcenter/tether in Blueprint's Firestore.
 * Call on every admin Overview load. Non-blocking — errors are swallowed
 * so a sync failure never breaks the admin UI.
 */
export async function syncCommandCenter(updatedBy = 'admin'): Promise<void> {
  const payload: Record<string, unknown> = {
    ...TETHER_STATS,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };

  const url = `${FIRESTORE_BASE}/commandcenter/tether?key=${BLUEPRINT_API_KEY}`;

  try {
    const res = await fetch(url, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    buildBody(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn('[CommandCenter] Sync failed:', res.status, err);
      return;
    }

    console.log('[CommandCenter] Tether stats synced to Build Control ✓');
  } catch (e) {
    console.warn('[CommandCenter] Sync error (non-blocking):', e);
  }
}

/**
 * Update just the deploy count — wire this into your CI/CD or call it
 * manually after each Replit deploy session.
 */
export async function updateTetherDeploys(count: number): Promise<void> {
  const url = `${FIRESTORE_BASE}/commandcenter/tether?key=${BLUEPRINT_API_KEY}`;
  try {
    await fetch(url, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    buildBody({ deploys: count }),
    });
    console.log('[CommandCenter] Deploy count updated to', count);
  } catch (e) {
    console.warn('[CommandCenter] Deploy update failed:', e);
  }
}
