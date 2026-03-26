import { useEffect, useState } from "react";
import { api, type BehavioralData } from "../lib/api";
import { KpiCard } from "../components/KpiCard";
import { ChartCard } from "../components/ChartCard";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";

export default function BehavioralIntelligence() {
  const [data, setData] = useState<BehavioralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.behavioral().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const kpis = data?.kpis ?? {} as BehavioralData["kpis"];
  const hasData = data && data.volatilityTrend.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Behavioral Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Child psychology metrics: sentiment volatility, anxiety indicators, cognitive fatigue</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Sentiment Volatility" value={kpis.avgVolatility != null ? Number(kpis.avgVolatility).toFixed(3) : "—"} icon={<span className="text-lg">~</span>} />
        <KpiCard title="Anxiety Score" value={kpis.avgAnxiety != null ? Number(kpis.avgAnxiety).toFixed(3) : "—"} icon={<span className="text-lg">!</span>} color="text-chart-5" />
        <KpiCard title="Cognitive Fatigue" value={kpis.avgFatigue != null ? Number(kpis.avgFatigue).toFixed(3) : "—"} icon={<span className="text-lg">Z</span>} color="text-chart-4" />
        <KpiCard title="Social Avoidance" value={kpis.avgSocialAvoidance != null ? Number(kpis.avgSocialAvoidance).toFixed(3) : "—"} icon={<span className="text-lg">x</span>} color="text-chart-3" />
        <KpiCard title="Avg Response Time" value={kpis.avgResponseLatency != null ? `${Math.round(Number(kpis.avgResponseLatency))}s` : "—"} icon={<span className="text-lg">T</span>} color="text-chart-2" />
        <KpiCard title="Emoji:Text Ratio" value={kpis.avgEmojiRatio != null ? Number(kpis.avgEmojiRatio).toFixed(3) : "—"} icon={<span className="text-lg">:)</span>} color="text-chart-1" />
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Sentiment Volatility Trend" subtitle="Higher = more emotional swings (potential stressor indicator)">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.volatilityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} />
                  <Legend />
                  <Line type="monotone" dataKey="avgVolatility" name="Volatility" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="avgAnxiety" name="Anxiety" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="avgFatigue" name="Fatigue" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Emoji-to-Text Ratio vs Message Length" subtitle="Rising emoji ratio with falling length suggests cognitive fatigue">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.emojiTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString()} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgEmojiRatio" name="Emoji Ratio" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="avgMsgLength" name="Avg Length" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {data.latestMetrics.length > 0 && (
            <ChartCard title="Per-User Behavioral Snapshot" subtitle="Most recent behavioral metrics by anonymized user">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 px-3">User</th>
                      <th className="text-right py-2 px-3">Volatility</th>
                      <th className="text-right py-2 px-3">Anxiety</th>
                      <th className="text-right py-2 px-3">Fatigue</th>
                      <th className="text-right py-2 px-3">Avoidance</th>
                      <th className="text-right py-2 px-3">Resp. Time</th>
                      <th className="text-right py-2 px-3">Emoji Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestMetrics.slice(0, 15).map((m, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 px-3 font-mono text-xs">#{m.userId}</td>
                        <td className="text-right py-2 px-3">{m.volatility?.toFixed(3) ?? "—"}</td>
                        <td className={`text-right py-2 px-3 ${(m.anxiety ?? 0) > 0.5 ? "text-red-500 font-semibold" : ""}`}>{m.anxiety?.toFixed(3) ?? "—"}</td>
                        <td className={`text-right py-2 px-3 ${(m.fatigue ?? 0) > 0.5 ? "text-amber-500 font-semibold" : ""}`}>{m.fatigue?.toFixed(3) ?? "—"}</td>
                        <td className="text-right py-2 px-3">{m.socialAvoidance?.toFixed(3) ?? "—"}</td>
                        <td className="text-right py-2 px-3">{m.responseLatency ? `${Math.round(m.responseLatency)}s` : "—"}</td>
                        <td className="text-right py-2 px-3">{m.emojiRatio?.toFixed(3) ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="font-medium">No behavioral data yet</p>
          <p className="text-sm mt-1">Run "Compute Metrics" from the overview to generate behavioral analysis</p>
        </div>
      )}
    </div>
  );
}
