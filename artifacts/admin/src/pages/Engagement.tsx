import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { EmptyState } from "@/components/EmptyState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Engagement() {
  const { data, isLoading } = useQuery({ queryKey: ["engagement"], queryFn: api.engagement });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading engagement data...</div>;
  if (!data) return <EmptyState message="No engagement data yet" />;

  const { sessions, sessionsBySource, dailySessions, messagingPatterns, dayOfWeekPattern, topEvents } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Engagement Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Usage patterns, session data, and feature adoption</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Sessions" value={sessions.totalSessions ?? 0} icon={<span className="text-lg">S</span>} />
        <KpiCard title="Avg Duration" value={sessions.avgDuration ? `${Math.round(sessions.avgDuration / 60)}m` : "—"} icon={<span className="text-lg">T</span>} color="text-chart-2" />
        <KpiCard title="Avg Pages/Session" value={sessions.avgPages ? Number(sessions.avgPages).toFixed(1) : "—"} icon={<span className="text-lg">P</span>} color="text-chart-3" />
        <KpiCard title="Avg Events/Session" value={sessions.avgEvents ? Number(sessions.avgEvents).toFixed(1) : "—"} icon={<span className="text-lg">E</span>} color="text-chart-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Messaging by Hour" subtitle="When are children most active?">
          {messagingPatterns.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={messagingPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={(h) => `${h}:00`} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(h) => `${h}:00`} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Messages" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No messaging pattern data" />}
        </ChartCard>

        <ChartCard title="Day of Week" subtitle="Message volume by day">
          {dayOfWeekPattern.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dayOfWeekPattern.map(d => ({ ...d, day: DAY_NAMES[d.dow] ?? d.dow }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" name="Messages" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No day pattern data" />}
        </ChartCard>
      </div>

      <ChartCard title="Daily Sessions" subtitle="Session volume over 30 days">
        {dailySessions.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailySessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <EmptyState message="No session data yet" />}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Sessions by Source" subtitle="App vs. web traffic">
          {sessionsBySource.length > 0 ? (
            <div className="space-y-3">
              {sessionsBySource.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <span className="text-sm font-semibold capitalize">{s.source}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Avg {s.avgDuration ? `${Math.round(s.avgDuration / 60)}m` : "—"}
                    </span>
                  </div>
                  <span className="text-lg font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No source data" />}
        </ChartCard>

        <ChartCard title="Top Events" subtitle="Most frequent tracked events (30 days)">
          {topEvents.length > 0 ? (
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {topEvents.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate mr-3">{e.eventName.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold text-muted-foreground">{e.count}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No events tracked yet" />}
        </ChartCard>
      </div>
    </div>
  );
}
