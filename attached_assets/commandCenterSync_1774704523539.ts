/**
 * commandCenterSync.ts
 * Drop into: apps/admin/src/lib/commandCenterSync.ts
 */

const BLUEPRINT_PROJECT_ID = 'work-blueprint';
const BLUEPRINT_API_KEY    = 'AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE';
const FIRESTORE_BASE       =
  `https://firestore.googleapis.com/v1/projects/${BLUEPRINT_PROJECT_ID}/databases/(default)/documents`;

const TETHER_STATS = {
  lineCount:    30800,
  fileCount:    184,
  version:      '—',
  featureCount: 40,
  deploys:      0,
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

export async function syncCommandCenter(updatedBy = 'admin'): Promise<void> {
  const payload: Record<string, unknown> = {
    ...TETHER_STATS,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };

  // Try PATCH first (update if exists), fall back to POST (create if not)
  const patchUrl = `${FIRESTORE_BASE}/commandcenter/tether?key=${BLUEPRINT_API_KEY}`;
  const postUrl  = `${FIRESTORE_BASE}/commandcenter?documentId=tether&key=${BLUEPRINT_API_KEY}`;
  const body     = buildBody(payload);

  try {
    // Attempt PATCH (upsert)
    let res = await fetch(patchUrl, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    // If document doesn't exist yet, PATCH may 404 — use POST to create
    if (res.status === 404) {
      console.log('[CommandCenter] Document not found, creating via POST...');
      res = await fetch(postUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    }

    const responseText = await res.text();

    if (!res.ok) {
      console.error('[CommandCenter] Sync FAILED:', res.status, res.statusText);
      console.error('[CommandCenter] Response body:', responseText);
      return;
    }

    console.log('[CommandCenter] Tether stats synced to Build Control ✓');
    console.log('[CommandCenter] Response:', responseText.slice(0, 200));
  } catch (e) {
    console.error('[CommandCenter] Sync error:', e);
  }
}

export async function updateTetherDeploys(count: number): Promise<void> {
  const url  = `${FIRESTORE_BASE}/commandcenter/tether?key=${BLUEPRINT_API_KEY}`;
  const body = buildBody({ deploys: count });
  try {
    const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body });
    const text = await res.text();
    if (!res.ok) { console.error('[CommandCenter] Deploy update FAILED:', res.status, text); return; }
    console.log('[CommandCenter] Deploy count updated to', count);
  } catch (e) {
    console.error('[CommandCenter] Deploy update error:', e);
  }
}
