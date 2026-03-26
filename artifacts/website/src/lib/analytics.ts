const API_BASE = "/api";
const SESSION_KEY = "tether_session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function send(eventName: string, metadata?: Record<string, unknown>) {
  try {
    await fetch(`${API_BASE}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "web",
        eventName,
        sessionId: getSessionId(),
        metadata,
        pageUrl: window.location.pathname,
        referrer: document.referrer || null,
      }),
    });
  } catch {
    // silent
  }
}

let sessionStarted = false;

export const analytics = {
  pageView(path: string) {
    send("page_view", { path });

    if (!sessionStarted) {
      sessionStarted = true;
      fetch(`${API_BASE}/analytics/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          source: "web",
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          platform: navigator.platform,
          screenResolution: `${screen.width}x${screen.height}`,
        }),
      }).catch(() => {});
    }
  },

  waitlistSignup(role: string) {
    send("waitlist_signup", { role });
  },

  ctaClick(label: string) {
    send("cta_click", { label });
  },

  scrollDepth(depth: number) {
    send("scroll_depth", { depth });
  },
};
