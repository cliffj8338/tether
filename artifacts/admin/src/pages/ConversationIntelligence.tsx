import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { EmptyState } from "@/components/EmptyState";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "#64748b", "#06b6d4",
  "#8b5cf6", "#f43f5e", "#10b981", "#f59e0b", "#6366f1",
];

const TOPIC_LABELS: Record<string, string> = {
  social: "Social", emotional: "Emotional", academic: "Academic", faith: "Faith",
  conflict: "Conflict", humor: "Humor", family: "Family", friendship: "Friendship",
  identity: "Identity", health: "Health", media: "Media", creative: "Creative",
  sports: "Sports", technology: "Tech", other: "Other",
};

export default function ConversationIntelligence() {
  const { data, isLoading } = useQuery({ queryKey: ["conversations"], queryFn: api.conversations });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading conversation intelligence...</div>;
  if (!data) return <EmptyState message="No conversation data yet" submessage="Messages will be analyzed as they are sent" />;

  const { topicDistribution, sentimentOverTime, emotionalToneDistribution, vocabularyByAge, averages, sentimentByTopic } = data;

  const hasData = topicDistribution.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Conversation Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered analysis of communication patterns across all conversations</p>
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="Avg Words/Message" value={averages.avgWordCount ? Number(averages.avgWordCount).toFixed(1) : "—"} icon={<span className="text-lg">Aa</span>} />
            <KpiCard title="Avg Sentiment" value={averages.avgSentiment ? Number(averages.avgSentiment).toFixed(2) : "—"} subtitle={Number(averages.avgSentiment) > 0 ? "Positive" : Number(averages.avgSentiment) < 0 ? "Negative" : "Neutral"} icon={<span className="text-lg">{Number(averages.avgSentiment) > 0 ? "+" : Number(averages.avgSentiment) < 0 ? "-" : "~"}</span>} color={Number(averages.avgSentiment) > 0 ? "text-chart-1" : "text-chart-5"} />
            <KpiCard title="Emoji Usage" value={`${(Number(averages.emojiRate ?? 0) * 100).toFixed(0)}%`} icon={<span className="text-lg">:)</span>} color="text-chart-3" />
            <KpiCard title="Vocabulary Level" value={`${(Number(averages.avgComplexity ?? 0) * 100).toFixed(0)}%`} subtitle="Complexity score" icon={<span className="text-lg">V</span>} color="text-chart-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Topic Distribution" subtitle="What are children talking about?">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={topicDistribution.map(t => ({ ...t, name: TOPIC_LABELS[t.topic] ?? t.topic }))} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {topicDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Emotional Tone Radar" subtitle="Distribution of emotional qualities">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={emotionalToneDistribution.slice(0, 10).map(t => ({ tone: t.tone.charAt(0).toUpperCase() + t.tone.slice(1), count: t.count }))}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="tone" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar dataKey="count" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Sentiment Trend" subtitle="Average sentiment score over time (-1 negative, +1 positive)">
            {sentimentOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={sentimentOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis domain={[-1, 1]} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                  <Line type="monotone" dataKey="avgSentiment" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Sentiment" />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Not enough data for trends" />}
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Vocabulary by Age Group" subtitle="Complexity and word count by age">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={vocabularyByAge.filter(v => v.ageGroup)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgWordCount" fill="hsl(var(--chart-1))" name="Avg Words" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgComplexity" fill="hsl(var(--chart-2))" name="Complexity" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sentiment by Topic" subtitle="How positive/negative are different subjects?">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={sentimentByTopic.map(s => ({ ...s, topic: TOPIC_LABELS[s.topic] ?? s.topic }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="topic" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis domain={[-1, 1]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgSentiment" name="Sentiment" radius={[4, 4, 0, 0]}>
                    {sentimentByTopic.map((s, i) => (
                      <Cell key={i} fill={s.avgSentiment >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      ) : (
        <EmptyState message="No conversation data yet" submessage="Message analysis runs automatically as children communicate" />
      )}
    </div>
  );
}
