/**
 * commandCenterSync.ts
 * Drop into: apps/admin/src/lib/commandCenterSync.ts
 *
 * Pulls live data from two sources:
 *   1. Tether API — /api/platform-costs (live vendor costs)
 *   2. Overview query data — passed in from the Overview component
 *      (users, messages, alerts — already fetched, no extra call)
 *
 * Writes a summary to commandcenter/tether in Blueprint's Firestore.
 * Called automatically on every admin Overview load.
 */

const BLUEPRINT_PROJECT_ID = 'work-blueprint';
const BLUEPRINT_API_KEY    = 'AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE';
const FIRESTORE_BASE       =
  `https://firestore.googleapis.com/v1/projects/${BLUEPRINT_PROJECT_ID}/databases/(default)/documents`;

const TETHER_API = 'https://tether-connect-cliffj8338.replit.app';

// ── Static facts (update when codebase grows) ────────────────────────
// These are code-level facts that don't live in any database.
// Update per session same as bumping BP_VERSION in Blueprint.
const STATIC = {
  lineCount:    30800,
  fileCount:    184,
  version:      '—',
  featureCount: 40,
  subApps: [
    { name: 'Admin Intelligence Dashboard', loc: 9879,  files: 86 },
    { name: 'Mobile App (Expo)',             loc: 6214,  files: 38 },
    { name: 'Marketing Website',             loc: 4172,  files: 30 },
    { name: 'API Server',                    loc: 3916,  files: 30 },
  ],
};

// ── Types ────────────────────────────────────────────────────────────
interface OverviewData {
  kpis: {
    totalUsers:       number;
    totalParents:     number;
    totalChildren:    number;
    totalMessages:    number;
    messages24h:      number;
    totalAlerts:      number;
    alerts7d:         number;
    flagRate:         string;
    blockedMessages:  number;
    newUsers7d:       number;
    totalConversations: number;
    faithModeUsers:   number;
    blockRate:        string;
  };
  trends: {
    messageTrend: { day: string; count: number }[];
    alertTrend:   { day: string; count: number }[];
    userGrowth:   { day: string; count: number }[];
  };
}

interface CostResponse {
  months:      { month: string; total: number; categories: Record<string, number> }[];
  grandTotal:  number;
  lastUpdated: string;
}

// ── Firestore REST serializer ────────────────────────────────────────
type FV =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values: FV[] } }
  | { mapValue: { fields: Record<string, FV> } };

function toFV(val: unknown): FV {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean')          return { booleanValue: val };
  if (typeof val === 'number')
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'string')           return { stringValue: val };
  if (Array.isArray(val))                return { arrayValue: { values: val.map(toFV) } };
  if (typeof val === 'object') {
    const fields: Record<string, FV> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) fields[k] = toFV(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function buildBody(data: Record<string, unknown>): string {
  const fields: Record<string, FV> = {};
  for (const [k, v] of Object.entries(data)) fields[k] = toFV(v);
  return JSON.stringify({ fields });
}

// ── Fetch live costs from Tether API ────────────────────────────────
async function fetchLiveCosts(): Promise<{ monthlyTotal: number; categories: Record<string, number>; lastUpdated: string } | null> {
  try {
    const res = await fetch(`${TETHER_API}/api/platform-costs`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn('[CommandCenter] Cost API returned', res.status);
      return null;
    }
    const data: CostResponse = await res.json();

    // Use the most recent month's data for monthly total + category breakdown
    const latest = data.months?.[data.months.length - 1];
    return {
      monthlyTotal: latest?.total ?? data.grandTotal ?? 0,
      categories:   latest?.categories ?? {},
      lastUpdated:  data.lastUpdated ?? new Date().toISOString(),
    };
  } catch (e) {
    console.warn('[CommandCenter] Could not fetch costs (non-blocking):', e);
    return null;
  }
}

// ── Main sync ────────────────────────────────────────────────────────
/**
 * Call this from Overview.tsx, passing the live query data:
 *
 *   useEffect(() => {
 *     if (data) syncCommandCenter(adminUser?.email ?? 'admin', data);
 *   }, [data]);
 *
 * All numbers come from live sources — nothing hardcoded except
 * the static code facts (lineCount, fileCount, featureCount).
 */
export async function syncCommandCenter(
  updatedBy = 'admin',
  overviewData?: OverviewData
): Promise<void> {

  // Fetch live costs in parallel — non-blocking if it fails
  const costs = await fetchLiveCosts();

  const payload: Record<string, unknown> = {
    // Static code facts
    ...STATIC,

    // Live platform metrics (from overview API)
    ...(overviewData ? {
      users: {
        total:    overviewData.kpis.totalUsers,
        parents:  overviewData.kpis.totalParents,
        children: overviewData.kpis.totalChildren,
        new7d:    overviewData.kpis.newUsers7d,
      },
      messages: {
        total:   overviewData.kpis.totalMessages,
        today:   overviewData.kpis.messages24h,
      },
      alerts: {
        total:  overviewData.kpis.totalAlerts,
        week:   overviewData.kpis.alerts7d,
      },
      conversations: overviewData.kpis.totalConversations,
      faithModeUsers: overviewData.kpis.faithModeUsers,
    } : {}),

    // Live costs (from /api/platform-costs)
    ...(costs ? {
      monthlyTotal:     costs.monthlyTotal,
      costCategories:   costs.categories,
      costsLastUpdated: costs.lastUpdated,
    } : {}),

    updatedBy,
    updatedAt: new Date().toISOString(),
  };

  const patchUrl = `${FIRESTORE_BASE}/commandcenter/tether?key=${BLUEPRINT_API_KEY}`;
  const postUrl  = `${FIRESTORE_BASE}/commandcenter?documentId=tether&key=${BLUEPRINT_API_KEY}`;
  const body     = buildBody(payload);

  try {
    let res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (res.status === 404) {
      res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    }

    if (!res.ok) {
      const err = await res.text();
      console.error('[CommandCenter] Sync FAILED:', res.status, err);
      return;
    }

    console.log('[CommandCenter] Tether synced ✓', {
      users:       overviewData?.kpis.totalUsers ?? '—',
      monthlyBurn: costs ? `$${costs.monthlyTotal.toFixed(2)}` : 'cost API unavailable',
    });
  } catch (e) {
    console.warn('[CommandCenter] Sync error (non-blocking):', e);
  }
}
