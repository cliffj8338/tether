import { useState, useRef, useEffect } from "react";
import { api, type AiQueryResponse } from "../lib/api";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Send, Bot, User, Loader2, Sparkles, MessageSquare, Shield, Users, Brain,
  Activity, TrendingUp, Globe, ArrowLeft, Save, RefreshCw, Download,
  Clock, Trash2, FolderOpen,
} from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface SavedReport {
  id: string;
  question: string;
  summary: string;
  data: AiQueryResponse;
  savedAt: string;
}

const STORAGE_KEY = "tether-saved-reports";

function loadSavedReports(): SavedReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function persistReports(reports: SavedReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

const REPORT_CATEGORIES = [
  {
    label: "Content & Communication",
    icon: MessageSquare,
    questions: [
      "What topics are children talking about most?",
      "What topics do different age groups talk about?",
      "What percentage of messages contain emoji vs slang?",
      "What are the trending keywords?",
      "Show me the emotional tone distribution",
      "Show me vocabulary complexity trends over time",
    ],
  },
  {
    label: "Safety & Alerts",
    icon: Shield,
    questions: [
      "Which hours have the highest alert rates?",
      "Show me the alert severity breakdown",
      "Give me a safety overview",
      "Show me conversation health scores",
    ],
  },
  {
    label: "Sentiment & Wellbeing",
    icon: Brain,
    questions: [
      "Show me sentiment trends by age group",
      "What are the anxiety and wellbeing indicators?",
    ],
  },
  {
    label: "Engagement & Activity",
    icon: Activity,
    questions: [
      "Which children have the most conversations?",
      "What's the average response time by age group?",
      "Show me message volume over time",
      "Show me session engagement stats",
    ],
  },
  {
    label: "Demographics & Growth",
    icon: Users,
    questions: [
      "Show me the platform growth overview",
      "What's the children age distribution?",
      "Show me trust level distribution",
      "What's the faith mode adoption rate?",
    ],
  },
  {
    label: "Behavioral Intelligence",
    icon: TrendingUp,
    questions: [
      "Show me churn risk distribution",
      "What are the social network roles?",
      "Show me the interest clusters",
    ],
  },
  {
    label: "Waitlist & Marketing",
    icon: Globe,
    questions: [
      "How many waitlist signups per day?",
      "Show me waitlist breakdown by role",
    ],
  },
];

function DynamicChart({ response }: { response: AiQueryResponse }) {
  if (!response.data || response.data.length === 0) return null;

  const chartType = response.chartType;
  const config = response.chartConfig ?? {};
  const data = response.data;

  const keys = Object.keys(data[0] ?? {});
  const xKey = config.xKey ?? keys[0];
  const yKey = config.yKey ?? keys.find(k => k !== xKey && typeof data[0][k] === "number") ?? keys[1];

  if (chartType === "number") {
    const row = data[0] ?? {};
    const entries = Object.entries(row).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length <= 2) {
      const [, value] = entries[entries.length - 1] ?? ["", ""];
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{String(value)}</div>
            <div className="text-sm text-muted-foreground mt-1">{config.label ?? entries[entries.length - 1]?.[0]}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : String(value)}</div>
            <div className="text-xs text-muted-foreground mt-1">{key.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>
    );
  }

  if (chartType === "bar" && xKey && yKey) {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data as any[]}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey={yKey} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line" && xKey && yKey) {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data as any[]}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "pie" && xKey && yKey) {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data as any[]} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={100}
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {(data as any[]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            {keys.map(k => <th key={k} className="text-left py-2 px-3">{k.replace(/_/g, " ")}</th>)}
          </tr>
        </thead>
        <tbody>
          {(data as any[]).slice(0, 50).map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              {keys.map(k => <td key={k} className="py-2 px-3">{String(row[k] ?? "—")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function exportCsv(data: Record<string, unknown>[], question: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const header = keys.join(",");
  const rows = data.map(row => keys.map(k => {
    const v = row[k];
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tether-report-${question.slice(0, 40).replace(/[^a-z0-9]/gi, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type View = "catalog" | "report" | "saved";

export default function AiResearchAssistant() {
  const [view, setView] = useState<View>("catalog");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentResult, setCurrentResult] = useState<AiQueryResponse | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [computing, setComputing] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(loadSavedReports);
  const [saveToast, setSaveToast] = useState("");

  const runReport = async (question: string) => {
    setCurrentQuestion(question);
    setCurrentResult(null);
    setView("report");
    setLoading(true);

    try {
      const response = await api.aiQuery(question);
      setCurrentResult(response);
    } catch {
      setCurrentResult({
        data: [],
        chartType: "none",
        summary: "Sorry, I encountered an error processing that query. Try rephrasing your question.",
        rowCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentQuestion) runReport(currentQuestion);
  };

  const handleSave = () => {
    if (!currentResult || !currentQuestion) return;
    const report: SavedReport = {
      id: Date.now().toString(),
      question: currentQuestion,
      summary: currentResult.summary,
      data: currentResult,
      savedAt: new Date().toISOString(),
    };
    const updated = [report, ...savedReports];
    setSavedReports(updated);
    persistReports(updated);
    setSaveToast("Report saved!");
    setTimeout(() => setSaveToast(""), 2000);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedReports.filter(r => r.id !== id);
    setSavedReports(updated);
    persistReports(updated);
  };

  const handleLoadSaved = (report: SavedReport) => {
    setCurrentQuestion(report.question);
    setCurrentResult(report.data);
    setView("report");
  };

  const handleExport = () => {
    if (currentResult?.data?.length) {
      exportCsv(currentResult.data, currentQuestion);
    }
  };

  const handleCompute = async () => {
    setComputing(true);
    try {
      await api.computeMetrics();
      setSaveToast("Advanced metrics computed successfully!");
      setTimeout(() => setSaveToast(""), 3000);
    } catch {
      setSaveToast("Failed to compute metrics.");
      setTimeout(() => setSaveToast(""), 3000);
    } finally {
      setComputing(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    runReport(q);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {view === "catalog" ? "25 pre-built reports — click to run, or ask your own question" :
             view === "saved" ? "Your saved reports" : currentQuestion}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {view !== "catalog" && (
            <button
              onClick={() => setView("catalog")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Reports
            </button>
          )}
          <button
            onClick={() => setView(view === "saved" ? "catalog" : "saved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              view === "saved" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Saved ({savedReports.length})
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="mb-3 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg text-sm font-medium text-center">
          {saveToast}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-4">
        {view === "catalog" && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl">
              {REPORT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat.label}</h3>
                    </div>
                    <div className="space-y-1">
                      {cat.questions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => runReport(q)}
                          className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 transition-colors text-foreground/80 hover:text-foreground"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleCompute}
                disabled={computing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {computing ? "Computing..." : "Compute Advanced Metrics (Behavioral + Network + Churn)"}
              </button>
            </div>
          </div>
        )}

        {view === "saved" && (
          <div className="space-y-2">
            {savedReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No saved reports yet. Run a report and click Save to add it here.</p>
              </div>
            ) : (
              savedReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleLoadSaved(report)}
                      className="flex-1 text-left"
                    >
                      <h3 className="text-sm font-medium text-foreground">{report.question}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.summary}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.savedAt).toLocaleString()}</span>
                        <span className="text-border">|</span>
                        <span>{report.data.rowCount ?? 0} rows</span>
                        <span className="text-border">|</span>
                        <span>{report.data.chartType}</span>
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { handleLoadSaved(report); setTimeout(handleRefresh, 100); }}
                        className="p-1.5 rounded hover:bg-muted transition-colors"
                        title="Re-run with fresh data"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(report.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                        title="Delete saved report"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === "report" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Analyzing your question, generating query, and preparing results...</p>
              </div>
            ) : currentResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Report
                  </button>
                  {currentResult.data && currentResult.data.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                  )}
                  {currentResult.sql && (
                    <details className="text-xs text-muted-foreground cursor-pointer ml-auto">
                      <summary className="hover:text-foreground px-2 py-1.5">View SQL</summary>
                      <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto max-h-40 overflow-y-auto absolute right-6 z-10 border border-border shadow-lg max-w-lg">
                        {currentResult.sql}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="bg-card rounded-lg border border-border p-5">
                  <p className="text-sm text-foreground leading-relaxed mb-4">{currentResult.summary}</p>
                  {currentResult.data && currentResult.data.length > 0 && (
                    <>
                      <DynamicChart response={currentResult} />
                      <div className="mt-3 text-xs text-muted-foreground">
                        {currentResult.rowCount} row{currentResult.rowCount !== 1 ? "s" : ""} returned
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your analytics data..."
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
