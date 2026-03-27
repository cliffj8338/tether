import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users-mgmt", search, roleFilter, page],
    queryFn: () => api.users({ search, role: roleFilter, page }),
  });

  const toggleAdmin = useMutation({
    mutationFn: (userId: number) => api.toggleAdmin(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users-mgmt"] }),
  });

  const togglePause = useMutation({
    mutationFn: (userId: number) => api.togglePause(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users-mgmt"] }),
  });

  const roleBadge = (role: string, isAdmin: boolean) => {
    if (isAdmin) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">admin</span>;
    const colors: Record<string, string> = {
      parent: "bg-blue-100 text-blue-700",
      child: "bg-green-100 text-green-700",
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[role] || "bg-gray-100 text-gray-700"}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage all platform users</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold">{data?.total ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Total Users</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.roleCounts?.parent ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Parents</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{data?.roleCounts?.child ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Children</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-red-600">{data?.roleCounts?.admin ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Admins</div>
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
            <option value="child">Children</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Trust</th>
                  <th className="text-left px-4 py-3 font-medium">Faith</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No users found</td></tr>
                ) : (
                  data?.users?.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: user.avatarColor || "#6B9E8A" }}>
                            {(user.displayName || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium">{user.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email || "—"}</td>
                      <td className="px-4 py-3">{roleBadge(user.role, user.isAdmin)}</td>
                      <td className="px-4 py-3">
                        {user.role === "child" ? (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(l => (
                              <div key={l} className={`w-2 h-2 rounded-full ${l <= (user.trustLevel || 1) ? "bg-primary" : "bg-muted"}`} />
                            ))}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {user.faithModeEnabled ? (
                          <span className="text-amber-600 text-xs font-medium">Enabled</span>
                        ) : <span className="text-muted-foreground text-xs">Off</span>}
                      </td>
                      <td className="px-4 py-3">
                        {user.isPaused ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Paused</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleAdmin.mutate(user.id)}
                            className="px-2 py-1 text-xs border rounded hover:bg-muted transition-colors"
                            title={user.isAdmin ? "Remove admin" : "Make admin"}
                          >
                            {user.isAdmin ? "Remove Admin" : "Make Admin"}
                          </button>
                          <button
                            onClick={() => togglePause.mutate(user.id)}
                            className="px-2 py-1 text-xs border rounded hover:bg-muted transition-colors"
                            title={user.isPaused ? "Unpause" : "Pause"}
                          >
                            {user.isPaused ? "Unpause" : "Pause"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > data.limit && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Page {data.page} of {Math.ceil(data.total / data.limit)}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-muted">Previous</button>
              <button disabled={page >= Math.ceil(data.total / data.limit)} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-muted">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
