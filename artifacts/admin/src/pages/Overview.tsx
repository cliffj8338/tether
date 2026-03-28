import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { EmptyState } from "@/components/EmptyState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { syncCommandCenter } from "@/lib/commandCenterSync";
import { useAuth } from "@/lib/auth-context";

function Icon({ d }: { d: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d} /></svg>;
}

export default function Overview() {
  const { data, isLoading } = useQuery({ queryKey: ["overview"], queryFn: api.overview });
  const { adminUser } = useAuth();

  useEffect(() => {
    if (!data) return;
    syncCommandCenter(adminUser?.email ?? 'admin', data);
  }, [data]);

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading analytics...</div>;
  if (!data) return <EmptyState message="No data available yet" submessage="Start using Tether to see analytics" />;

  const { kpis, trends } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time intelligence across Tether</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Users" value={kpis.totalUsers} subtitle={`${kpis.totalParents} parents, ${kpis.totalChildren} children`} icon={<Icon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />} info="Total registered accounts across the platform, broken down by parent and child roles." />
        <KpiCard title="Messages" value={kpis.totalMessages} subtitle={`${kpis.messages24h} today`} icon={<Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />} color="text-chart-2" info="Total messages sent through Tether. Today's count resets at midnight UTC." />
        <KpiCard title="Alerts" value={kpis.totalAlerts} subtitle={`${kpis.alerts7d} this week`} icon={<Icon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />} color="text-chart-3" info="Safety alerts generated when messages trigger content filters. Higher severity levels (L3-L5) indicate more concerning content." />
        <KpiCard title="Flag Rate" value={kpis.flagRate} subtitle={`${kpis.blockedMessages} blocked`} icon={<Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />} color="text-chart-5" info="Percentage of messages that were flagged or blocked by content filters. A lower rate indicates healthier communication." />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="New Users (7d)" value={kpis.newUsers7d} icon={<Icon d="M16 21v-2a4 4 0 00-4-4H6" />} info="New parent and child accounts created in the last 7 days. Measures growth velocity." />
        <KpiCard title="Conversations" value={kpis.totalConversations} icon={<Icon d="M21 11.5a8.38 8.38 0 01-.9 3.8" />} color="text-chart-2" info="Total active conversation threads between children and their approved contacts." />
        <KpiCard title="Faith Mode" value={kpis.faithModeUsers} subtitle="users enabled" icon={<Icon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />} color="text-chart-4" info="Children with Faith Mode enabled. This adds faith-based content filters and positive scripture-based responses." />
        <KpiCard title="Block Rate" value={kpis.blockRate} icon={<Icon d="M18.36 6.64A9 9 0 015.64 19.36" />} color="text-chart-5" info="Percentage of messages that were completely blocked (not delivered). Different from Flag Rate which includes warnings." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Message Volume" subtitle="Last 30 days" info="Daily count of all messages sent through the platform over the past 30 days. Spikes may indicate events or viral sharing.">
          {trends.messageTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trends.messageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No messages yet" />}
        </ChartCard>

        <ChartCard title="Alert Trend" subtitle="Last 30 days" info="Daily count of safety alerts triggered. Rising trends may indicate a need to review content filter settings.">
          {trends.alertTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trends.alertTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No alerts yet" />}
        </ChartCard>
      </div>

      <ChartCard title="User Growth" subtitle="New signups over last 30 days" info="Daily new account registrations. Tracks organic and marketing-driven growth over 30 days.">
        {trends.userGrowth.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trends.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : <EmptyState message="No users yet" />}
      </ChartCard>
    </div>
  );
}
