import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PlatformCostEntry, type PlatformCostsData } from "@/lib/api";

const CATEGORIES = [
  "Compute",
  "Database",
  "Storage",
  "Egress",
  "AI / LLM",
  "SMS (Twilio)",
  "Email (Resend)",
  "Domain / DNS",
  "RevenueCat",
  "Other",
];

const MONTHS = (() => {
  const ms: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    ms.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return ms;
})();

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo) - 1]} ${y}`;
}

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function PlatformCosts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PlatformCostsData>({
    queryKey: ["platform-costs"],
    queryFn: api.costs,
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [month, setMonth] = useState(MONTHS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const addMutation = useMutation({
    mutationFn: (data: { month: string; category: string; amount: number; notes: string }) =>
      api.addCost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-costs"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number; month: string; category: string; amount: number; notes: string }) =>
      api.updateCost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-costs"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteCost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platform-costs"] }),
  });

  function resetForm() {
    setShowForm(false);
    setEditId(null);
    setMonth(MONTHS[0]);
    setCategory(CATEGORIES[0]);
    setAmount("");
    setNotes("");
  }

  function startEdit(entry: PlatformCostEntry) {
    setEditId(entry.id);
    setMonth(entry.month);
    setCategory(entry.category);
    setAmount(entry.amount);
    setNotes(entry.notes || "");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { month, category, amount: parseFloat(amount), notes };
    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      addMutation.mutate(payload);
    }
  }

  const categoryColors: Record<string, string> = {
    Compute: "bg-blue-100 text-blue-800",
    Database: "bg-purple-100 text-purple-800",
    Storage: "bg-cyan-100 text-cyan-800",
    Egress: "bg-orange-100 text-orange-800",
    "AI / LLM": "bg-violet-100 text-violet-800",
    "SMS (Twilio)": "bg-green-100 text-green-800",
    "Email (Resend)": "bg-pink-100 text-pink-800",
    "Domain / DNS": "bg-yellow-100 text-yellow-800",
    RevenueCat: "bg-indigo-100 text-indigo-800",
    Other: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Costs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track monthly infrastructure and service costs. Public API available for Command Center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Public API Endpoint</div>
            <code className="text-xs bg-muted px-2 py-1 rounded">/api/platform-costs</code>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-4">{editId ? "Edit Cost Entry" : "Add Cost Entry"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{formatMonth(m)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
            <div className="col-span-full flex gap-2">
              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {addMutation.isPending || updateMutation.isPending ? "Saving..." : editId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-xs text-muted-foreground mb-1">Total All Time</div>
              <div className="text-2xl font-bold">{formatCurrency(data?.grandTotal || 0)}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-xs text-muted-foreground mb-1">Current Month</div>
              <div className="text-2xl font-bold">
                {formatCurrency(data?.months?.[0]?.total || 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {data?.months?.[0]?.month ? formatMonth(data.months[0].month) : "No entries"}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
              <div className="text-sm font-medium mt-2">
                {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "Never"}
              </div>
            </div>
          </div>

          {data?.months?.map((m) => (
            <div key={m.month} className="bg-card border border-border rounded-xl mb-4 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold">{formatMonth(m.month)}</h3>
                <span className="text-lg font-bold">{formatCurrency(m.total)}</span>
              </div>
              <div className="divide-y divide-border">
                {m.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[entry.category] || "bg-gray-100 text-gray-800"}`}>
                      {entry.category}
                    </span>
                    <span className="font-mono font-semibold flex-shrink-0">{formatCurrency(parseFloat(entry.amount))}</span>
                    <span className="text-sm text-muted-foreground flex-1 truncate">{entry.notes || ""}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(entry)}
                        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this entry?")) deleteMutation.mutate(entry.id);
                        }}
                        className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(!data?.months || data.months.length === 0) && (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold mb-1">No cost entries yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first platform cost entry to start tracking expenses.</p>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                + Add First Entry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
