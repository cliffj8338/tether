import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { EmptyState } from "@/components/EmptyState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const SENTIMENT_COLORS: Record<string, string> = {
  very_positive: "#059669", positive: "#6B9E8A", neutral: "#94a3b8",
  negative: "#f97316", very_negative: "#ef4444",
};

export default function ContentResearch() {
  const { data, isLoading } = useQuery({ queryKey: ["content"], queryFn: api.content });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading content research...</div>;
  if (!data) return <EmptyState message="No content data yet" submessage="Message analysis data will appear as conversations grow" />;

  const { keywords, sentimentByAge, communicationComplexity, emojiSlangUsage } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Research</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep linguistic and thematic analysis of children's digital communication</p>
      </div>

      <ChartCard title="Communication Complexity Over Time" subtitle="Word count and vocabulary sophistication trends">
        {communicationComplexity.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={communicationComplexity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 1]} />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
              <Line yAxisId="left" type="monotone" dataKey="avgWordCount" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Avg Words" />
              <Line yAxisId="right" type="monotone" dataKey="avgComplexity" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Complexity" />
              <Line yAxisId="left" type="monotone" dataKey="avgSentences" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="Avg Sentences" />
            </LineChart>
          </ResponsiveContainer>
        ) : <EmptyState message="Not enough data for trends" />}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Sentiment by Age Group" subtitle="Emotional valence distribution across age groups">
          {sentimentByAge.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(
                sentimentByAge.reduce<Record<string, { label: string; count: number }[]>>((acc, item) => {
                  const group = item.ageGroup ?? "Unknown";
                  if (!acc[group]) acc[group] = [];
                  acc[group].push({ label: item.sentimentLabel, count: item.count });
                  return acc;
                }, {})
              ).map(([ageGroup, sentiments]) => (
                <div key={ageGroup}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{ageGroup}</p>
                  <div className="flex gap-1 h-6 rounded overflow-hidden">
                    {sentiments.map((s, i) => {
                      const total = sentiments.reduce((sum, x) => sum + x.count, 0);
                      const pct = total > 0 ? (s.count / total) * 100 : 0;
                      return pct > 0 ? (
                        <div
                          key={i}
                          className="h-full rounded-sm"
                          style={{ width: `${pct}%`, backgroundColor: SENTIMENT_COLORS[s.label] ?? "#94a3b8" }}
                          title={`${s.label}: ${s.count} (${pct.toFixed(0)}%)`}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-3 mt-2">
                {Object.entries(SENTIMENT_COLORS).map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="text-xs text-muted-foreground capitalize">{label.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyState message="No sentiment data" />}
        </ChartCard>

        <ChartCard title="Emoji & Slang Usage by Age" subtitle="Digital communication style markers">
          {emojiSlangUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={emojiSlangUsage.filter(e => e.ageGroup)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                <Bar dataKey="emojiRate" fill="hsl(var(--chart-3))" name="Emoji Rate" radius={[4, 4, 0, 0]} />
                <Bar dataKey="slangRate" fill="hsl(var(--chart-4))" name="Slang Rate" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No usage data" />}
        </ChartCard>
      </div>

      <ChartCard title="Trending Keywords" subtitle="Anonymized topic keywords extracted from conversations (last 30 days)">
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border"
                style={{
                  fontSize: `${Math.min(1 + (k.occurrenceCount / 10) * 0.3, 1.4)}rem`,
                  opacity: Math.max(0.5, Math.min(1, k.occurrenceCount / 20)),
                }}
              >
                {k.keyword}
                <span className="ml-1.5 text-xs text-muted-foreground">{k.occurrenceCount}</span>
              </span>
            ))}
          </div>
        ) : <EmptyState message="No keyword data yet" submessage="Keywords are extracted as messages are analyzed" />}
      </ChartCard>
    </div>
  );
}
