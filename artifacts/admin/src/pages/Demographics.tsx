import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { EmptyState } from "@/components/EmptyState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const TRUST_LABELS: Record<number, string> = { 1: "L1 — Restricted", 2: "L2 — Guided", 3: "L3 — Moderate", 4: "L4 — Trusted", 5: "L5 — Independent" };

export default function Demographics() {
  const { data, isLoading } = useQuery({ queryKey: ["demographics"], queryFn: api.demographics });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading demographics...</div>;
  if (!data) return <EmptyState message="No demographic data yet" />;

  const { ageDistribution, gradeDistribution, trustLevelDistribution, faithMode, familySizeDistribution, avgChildrenPerFamily, pausedAccounts } = data;

  const familySizeData = Object.entries(familySizeDistribution).map(([size, count]) => ({ size: `${size} child${size === "1" ? "" : "ren"}`, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demographics & Behavior</h1>
        <p className="text-sm text-muted-foreground mt-1">User composition and behavioral patterns</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Faith Mode" value={`${faithMode.adoptionRate}%`} subtitle={`${faithMode.enabled} of ${faithMode.total} children`} icon={<span className="text-lg">+</span>} color="text-chart-3" />
        <KpiCard title="Avg Family Size" value={avgChildrenPerFamily} subtitle="children per family" icon={<span className="text-lg">F</span>} />
        <KpiCard title="Paused Accounts" value={pausedAccounts} icon={<span className="text-lg">P</span>} color="text-chart-3" />
        <KpiCard title="Total Children" value={ageDistribution.reduce((s, a) => s + a.count, 0)} icon={<span className="text-lg">C</span>} color="text-chart-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Age Distribution" subtitle="Children by age">
          {ageDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ageDistribution.filter(a => a.age !== null)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Age", position: "bottom", fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Children" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No age data" />}
        </ChartCard>

        <ChartCard title="Trust Level Distribution" subtitle="Children across graduated trust levels">
          {trustLevelDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trustLevelDistribution.map(t => ({ ...t, label: TRUST_LABELS[t.level] ?? `Level ${t.level}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Children" radius={[4, 4, 0, 0]}>
                  {trustLevelDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No trust level data" />}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Grade Distribution" subtitle="Children by school grade">
          {gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={gradeDistribution.filter(g => g.grade !== null)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" name="Children" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No grade data" />}
        </ChartCard>

        <ChartCard title="Family Size" subtitle="Distribution of children per family">
          {familySizeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={familySizeData} dataKey="count" nameKey="size" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {familySizeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No family data" />}
        </ChartCard>
      </div>
    </div>
  );
}
