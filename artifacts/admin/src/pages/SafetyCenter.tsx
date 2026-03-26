import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { EmptyState } from "@/components/EmptyState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from "recharts";

const LEVEL_COLORS: Record<string, string> = {
  level1: "#94a3b8", level2: "#f59e0b", level3: "#f97316",
  level4: "#ef4444", level5: "#991b1b", none: "#6B9E8A",
};
const LEVEL_LABELS: Record<string, string> = {
  level1: "L1 — Tone", level2: "L2 — Mild", level3: "L3 — Unkind",
  level4: "L4 — High", level5: "L5 — Critical", none: "Clean",
};

export default function SafetyCenter() {
  const { data, isLoading } = useQuery({ queryKey: ["safety"], queryFn: api.safety });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading safety analytics...</div>;
  if (!data) return <EmptyState message="No safety data yet" />;

  const { alertsByLevel, alertsTrend, blockedMessages, totalMessages, blockRate, alertReviewRate, topFlaggedChildren, hourlyDistribution } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Safety Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Content moderation effectiveness and alert patterns</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Block Rate" value={`${blockRate}%`} subtitle={`${blockedMessages} of ${totalMessages} messages`} icon={<span className="text-lg font-bold">!</span>} color="text-chart-5" />
        <KpiCard title="Review Rate" value={`${alertReviewRate}%`} subtitle="Alerts read by parents" icon={<span className="text-lg">R</span>} color="text-chart-1" />
        <KpiCard title="Total Blocked" value={blockedMessages} icon={<span className="text-lg">X</span>} color="text-chart-5" />
        <KpiCard title="Total Alerts (30d)" value={alertsByLevel.reduce((s, a) => s + a.count, 0)} icon={<span className="text-lg">A</span>} color="text-chart-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Alerts by Severity" subtitle="Distribution across alert levels (30 days)">
          {alertsByLevel.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={alertsByLevel.map(a => ({ ...a, label: LEVEL_LABELS[a.level] ?? a.level }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Alerts" radius={[4, 4, 0, 0]}>
                  {alertsByLevel.map((a, i) => <Cell key={i} fill={LEVEL_COLORS[a.level] ?? "#94a3b8"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No alerts" />}
        </ChartCard>

        <ChartCard title="Alert Trend" subtitle="Daily alerts over 30 days">
          {alertsTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={alertsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No alert trend data" />}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Hourly Alert Distribution" subtitle="When do flags happen?">
          {hourlyDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={(h) => `${h}:00`} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(h) => `${h}:00`} />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" name="Alerts" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No hourly data" />}
        </ChartCard>

        <ChartCard title="Most Flagged Profiles" subtitle="Anonymized — by age group (30 days)">
          {topFlaggedChildren.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {topFlaggedChildren.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-chart-5/10 text-chart-5 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <span className="text-sm font-medium">Age Group: {c.ageGroup}</span>
                      <span className="text-xs text-muted-foreground ml-2">Grade: {c.grade}</span>
                      {c.faithMode && <span className="text-xs text-chart-3 ml-2">Faith Mode</span>}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-chart-5">{c.count} flags</span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No flagged profiles" />}
        </ChartCard>
      </div>
    </div>
  );
}
