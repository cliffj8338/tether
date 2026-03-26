import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  color?: string;
}

export function KpiCard({ title, value, subtitle, icon, trend, color = "text-primary" }: KpiCardProps) {
  return (
    <div className="bg-card rounded-xl border border-card-border p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <span className={`${color} opacity-70`}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-card-foreground">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      {trend && <p className="text-xs text-primary font-semibold mt-1">{trend}</p>}
    </div>
  );
}
