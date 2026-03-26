import { useEffect, useState } from "react";
import { api, type PredictionsData } from "../lib/api";
import { KpiCard } from "../components/KpiCard";
import { ChartCard } from "../components/ChartCard";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { AlertTriangle } from "lucide-react";

const RISK_COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
const FACTOR_LABELS: Record<string, string> = {
  shrinking_message_length: "Shrinking Messages",
  increasing_response_time: "Slower Responses",
  extended_silence: "Extended Silence",
  declining_sessions: "Fewer Sessions",
};

export default function PredictiveAnalytics() {
  const [data, setData] = useState<PredictionsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.predictions().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const churn = data?.churn;
  const dist = churn?.riskDistribution ?? { high: 0, medium: 0, low: 0 };
  const pieData = [
    { name: "High Risk", value: dist.high },
    { name: "Medium Risk", value: dist.medium },
    { name: "Low Risk", value: dist.low },
  ].filter(d => d.value > 0);
  const hasChurnData = pieData.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Churn prediction, temporal anomalies, and interest graphs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="High Risk" value={dist.high} icon={<span className="text-lg text-red-500">!</span>} color="text-red-500" />
        <KpiCard title="Medium Risk" value={dist.medium} icon={<span className="text-lg text-amber-500">~</span>} color="text-amber-500" />
        <KpiCard title="Low Risk" value={dist.low} icon={<span className="text-lg text-green-500">ok</span>} color="text-green-500" />
        <KpiCard title="Anomalies" value={data?.anomalies?.length ?? 0} icon={<span className="text-lg">A</span>} color="text-chart-4" />
      </div>

      {hasChurnData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Churn Risk Distribution" subtitle="The Silence Gradient model predicts user departure">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.name.includes("High") ? RISK_COLORS.high : entry.name.includes("Medium") ? RISK_COLORS.medium : RISK_COLORS.low} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Risk Factor Frequency" subtitle="What signals predict churn?">
              {churn && churn.riskFactorFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={churn.riskFactorFrequency.map(f => ({ ...f, label: FACTOR_LABELS[f.factor] ?? f.factor }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">No risk factors detected</div>
              )}
            </ChartCard>
          </div>

          <ChartCard title="At-Risk Users" subtitle="Users with highest churn probability (Silence Gradient model)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3">User</th>
                    <th className="text-right py-2 px-3">Risk Score</th>
                    <th className="text-right py-2 px-3">Days Inactive</th>
                    <th className="text-right py-2 px-3">Silence Grad.</th>
                    <th className="text-right py-2 px-3">Msg Length Grad.</th>
                    <th className="text-left py-2 px-3">Risk Factors</th>
                  </tr>
                </thead>
                <tbody>
                  {churn?.topRisks.slice(0, 15).map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 px-3 font-mono text-xs">#{r.userId}</td>
                      <td className="text-right py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          r.riskScore > 0.7 ? "bg-red-100 text-red-700" :
                          r.riskScore > 0.3 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {(r.riskScore * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">{r.daysInactive}</td>
                      <td className="text-right py-2 px-3">{r.silenceGradient?.toFixed(3)}</td>
                      <td className="text-right py-2 px-3">{r.msgLengthGradient?.toFixed(3)}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(r.riskFactors ?? []).map((f, j) => (
                            <span key={j} className="px-1.5 py-0.5 bg-muted rounded text-xs">{FACTOR_LABELS[f] ?? f}</span>
                          ))}
                        </div>
                      </td>
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
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-medium">No prediction data yet</p>
          <p className="text-sm mt-1">Run "Compute Metrics" to generate churn predictions</p>
        </div>
      )}

      {data?.anomalies && data.anomalies.length > 0 && (
        <ChartCard title="Temporal Anomalies" subtitle="Black Swan events and unusual patterns detected">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Metric</th>
                  <th className="text-right py-2 px-3">Baseline</th>
                  <th className="text-right py-2 px-3">Observed</th>
                  <th className="text-right py-2 px-3">Change</th>
                  <th className="text-right py-2 px-3">Severity</th>
                  <th className="text-left py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.anomalies.map((a, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 px-3">{a.type}</td>
                    <td className="py-2 px-3">{a.metric}</td>
                    <td className="text-right py-2 px-3">{a.baseline?.toFixed(1)}</td>
                    <td className="text-right py-2 px-3">{a.observed?.toFixed(1)}</td>
                    <td className="text-right py-2 px-3 font-semibold">{a.percentChange ? `${a.percentChange > 0 ? "+" : ""}${a.percentChange.toFixed(0)}%` : "—"}</td>
                    <td className="text-right py-2 px-3">{a.severity?.toFixed(2)}</td>
                    <td className="py-2 px-3">{a.resolved ? <span className="text-green-500">Resolved</span> : <span className="text-amber-500">Active</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
