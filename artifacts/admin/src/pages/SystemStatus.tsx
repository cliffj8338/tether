import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  operational: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  degraded: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  down: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  not_configured: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" },
};

export default function SystemStatus() {
  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["system-status"],
    queryFn: () => api.systemStatus(),
    refetchInterval: 30000,
  });

  const allOperational = data?.services?.every((s: any) => s.status === "operational" || s.status === "not_configured");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Status</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time health monitoring for all services</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">Checking system status...</div>
      ) : (
        <>
          <div className={`border rounded-xl p-5 flex items-center gap-4 ${allOperational ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
            <div className={`w-4 h-4 rounded-full ${allOperational ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
            <div>
              <div className={`font-semibold ${allOperational ? "text-green-800" : "text-yellow-800"}`}>
                {allOperational ? "All Systems Operational" : "Some Services Need Attention"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Last checked: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card border rounded-xl p-4">
              <div className="text-lg font-bold font-mono">{data?.version}</div>
              <div className="text-xs text-muted-foreground">Version</div>
            </div>
            <div className="bg-card border rounded-xl p-4">
              <div className="text-lg font-bold">{data?.uptime ? formatUptime(data.uptime) : "—"}</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="bg-card border rounded-xl p-4">
              <div className="text-lg font-bold capitalize">{data?.environment}</div>
              <div className="text-xs text-muted-foreground">Environment</div>
            </div>
            <div className="bg-card border rounded-xl p-4">
              <div className="text-lg font-bold font-mono">{data?.nodeVersion}</div>
              <div className="text-xs text-muted-foreground">Node.js</div>
            </div>
          </div>

          <div className="bg-card border rounded-xl">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Services & Integrations</h3>
            </div>
            <div className="divide-y">
              {data?.services?.map((service: any) => {
                const colors = statusColors[service.status] || statusColors.down;
                return (
                  <div key={service.name} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                      <div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-muted-foreground">{service.details}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {service.latency !== null && service.latency !== undefined && (
                        <span className="text-xs text-muted-foreground font-mono">{service.latency}ms</span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {service.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {data?.memoryUsage && (
            <div className="bg-card border rounded-xl">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Memory Usage</h3>
              </div>
              <div className="p-4 grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium">{formatBytes(data.memoryUsage.heapUsed)}</div>
                  <div className="text-xs text-muted-foreground">Heap Used</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{formatBytes(data.memoryUsage.heapTotal)}</div>
                  <div className="text-xs text-muted-foreground">Heap Total</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{formatBytes(data.memoryUsage.rss)}</div>
                  <div className="text-xs text-muted-foreground">RSS</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{formatBytes(data.memoryUsage.external)}</div>
                  <div className="text-xs text-muted-foreground">External</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(data.memoryUsage.heapUsed / data.memoryUsage.heapTotal) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {Math.round((data.memoryUsage.heapUsed / data.memoryUsage.heapTotal) * 100)}% heap utilization
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
