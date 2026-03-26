import { useEffect, useState } from "react";
import { api, type NetworkData } from "../lib/api";
import { KpiCard } from "../components/KpiCard";
import { ChartCard } from "../components/ChartCard";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Network } from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const ROLE_LABELS: Record<string, string> = {
  leader: "Leader",
  initiator: "Initiator",
  influencer: "Influencer",
  observer: "Observer",
  participant: "Participant",
};

export default function NetworkAnalysis() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.network().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const kpis = data?.kpis ?? {} as NetworkData["kpis"];
  const hasData = data && data.topInfluencers.length > 0;

  const topologyLabel = data?.networkTopology === "mesh" ? "Mesh (Healthy)" : data?.networkTopology === "cluster" ? "Clustered" : "Star (Centralized)";
  const topologyColor = data?.networkTopology === "mesh" ? "text-chart-1" : data?.networkTopology === "cluster" ? "text-chart-4" : "text-chart-5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Network Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Influence mapping, graph density, and social network topology</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Graph Density" value={kpis.graphDensity ? Number(kpis.graphDensity).toFixed(3) : "—"} icon={<span className="text-lg">G</span>} />
        <KpiCard title="Topology" value={topologyLabel} icon={<span className="text-lg">T</span>} color={topologyColor} />
        <KpiCard title="Total Nodes" value={kpis.totalNodes ?? 0} icon={<span className="text-lg">N</span>} color="text-chart-2" />
        <KpiCard title="Avg Reciprocity" value={kpis.avgReciprocity ? Number(kpis.avgReciprocity).toFixed(2) : "—"} icon={<span className="text-lg">R</span>} color="text-chart-3" />
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Network Role Distribution" subtitle="Who plays what role in the social graph?">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.roleDistribution.map(r => ({ ...r, name: ROLE_LABELS[r.role] ?? r.role }))}
                    dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.roleDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Influencers" subtitle="Users whose messages trigger the most downstream activity">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.topInfluencers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="userId" tick={{ fontSize: 11 }} tickFormatter={(id) => `#${id}`} width={50} />
                  <Tooltip />
                  <Bar dataKey="influenceScore" name="Influence Score" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Influencer Details" subtitle="Detailed breakdown of top network nodes">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3">User</th>
                    <th className="text-left py-2 px-3">Role</th>
                    <th className="text-right py-2 px-3">Influence</th>
                    <th className="text-right py-2 px-3">Reply Trigger</th>
                    <th className="text-right py-2 px-3">Connections</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topInfluencers.map((inf, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 px-3 font-mono text-xs">#{inf.userId}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          inf.role === "leader" ? "bg-green-100 text-green-700" :
                          inf.role === "influencer" ? "bg-blue-100 text-blue-700" :
                          inf.role === "initiator" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {ROLE_LABELS[inf.role] ?? inf.role}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3 font-semibold">{inf.influenceScore?.toFixed(3)}</td>
                      <td className="text-right py-2 px-3">{(inf.replyTriggerRate * 100).toFixed(1)}%</td>
                      <td className="text-right py-2 px-3">{inf.connections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Network className="w-8 h-8" />
          </div>
          <p className="font-medium">No network data yet</p>
          <p className="text-sm mt-1">Run "Compute Metrics" to generate network analysis</p>
        </div>
      )}
    </div>
  );
}
