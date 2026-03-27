import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function WaitlistManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["waitlist", search, roleFilter, page],
    queryFn: () => api.waitlist({ search, role: roleFilter, page }),
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      parent: "bg-blue-100 text-blue-700",
      school: "bg-purple-100 text-purple-700",
      church: "bg-amber-100 text-amber-700",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[role] || "bg-gray-100 text-gray-700"}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Waitlist Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and export waitlist signups</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold">{data?.total ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Total Signups</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.roleCounts?.parent ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Parents</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600">{data?.roleCounts?.school ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Schools</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-600">{data?.roleCounts?.church ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Churches</div>
        </div>
      </div>

      <div className="bg-card border rounded-xl">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border rounded-lg bg-background"
          >
            <option value="all">All Roles</option>
            <option value="parent">Parents</option>
            <option value="school">Schools</option>
            <option value="church">Churches</option>
          </select>
          <button
            onClick={() => {
              if (!data?.entries) return;
              const sanitize = (v: string) => {
                let s = (v || "").replace(/"/g, '""');
                if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
                return `"${s}"`;
              };
              const csv = "Name,Email,Role,Signed Up\n" +
                data.entries.map((e: any) => `${sanitize(e.name || "")},${sanitize(e.email)},${sanitize(e.role)},${sanitize(new Date(e.createdAt).toLocaleDateString())}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "tether-waitlist.csv";
              a.click();
            }}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Export CSV
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {data?.entries?.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No waitlist entries found</td></tr>
                ) : (
                  data?.entries?.map((entry: any) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{entry.name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.email}</td>
                      <td className="px-4 py-3">{roleBadge(entry.role)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > data.limit && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {data.page} of {Math.ceil(data.total / data.limit)}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= Math.ceil(data.total / data.limit)}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
