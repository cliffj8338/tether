import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { EmptyState } from "@/components/EmptyState";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function WebsiteAnalytics() {
  const { data, isLoading } = useQuery({ queryKey: ["website"], queryFn: api.website });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading website analytics...</div>;
  if (!data) return <EmptyState message="No website data yet" submessage="Website analytics will appear as visitors arrive" />;

  const { pageViews, dailyTraffic, waitlistConversions, referrers, webSessions } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Website Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Marketing site traffic, conversions, and engagement</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Sessions" value={webSessions.totalSessions ?? 0} icon={<span className="text-lg">S</span>} />
        <KpiCard title="Avg Duration" value={webSessions.avgDuration ? `${Math.round(webSessions.avgDuration / 60)}m` : "—"} icon={<span className="text-lg">T</span>} color="text-chart-2" />
        <KpiCard title="Pages/Session" value={webSessions.avgPages ? Number(webSessions.avgPages).toFixed(1) : "—"} icon={<span className="text-lg">P</span>} color="text-chart-3" />
        <KpiCard title="Page Views" value={pageViews.reduce((s, p) => s + p.count, 0)} icon={<span className="text-lg">V</span>} color="text-chart-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Daily Traffic" subtitle="Total events and unique visitors (30 days)">
          {dailyTraffic.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} name="Total Events" />
                <Area type="monotone" dataKey="uniqueVisitors" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} strokeWidth={2} name="Unique Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No traffic data" />}
        </ChartCard>

        <ChartCard title="Waitlist Conversions" subtitle="Daily waitlist signups from website">
          {waitlistConversions.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={waitlistConversions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Signups" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No conversion data yet" />}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top Pages" subtitle="Most viewed pages (30 days)">
          {pageViews.length > 0 ? (
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {pageViews.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate mr-3">{p.page || "/"}</span>
                  <span className="text-sm font-bold text-muted-foreground">{p.count}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No page view data" />}
        </ChartCard>

        <ChartCard title="Top Referrers" subtitle="Where traffic comes from">
          {referrers.length > 0 ? (
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate mr-3">{r.referrer || "(direct)"}</span>
                  <span className="text-sm font-bold text-muted-foreground">{r.count}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No referrer data" />}
        </ChartCard>
      </div>
    </div>
  );
}
