import { useState, useRef, useEffect } from "react";
import { api, type AiQueryResponse } from "../lib/api";
import { ChartCard } from "../components/ChartCard";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface Message {
  role: "user" | "assistant";
  content: string;
  data?: AiQueryResponse;
}

const EXAMPLE_QUESTIONS = [
  "What topics are children talking about most this week?",
  "Show me sentiment trends by age group",
  "Which hours have the highest alert rates?",
  "How many waitlist signups per day this month?",
  "What's the average response time by age group?",
  "Which children have the most conversations?",
  "Show me vocabulary complexity trends over time",
  "What percentage of messages contain emoji vs slang?",
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
    const value = data[0]?.[yKey ?? keys[0]];
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">{String(value)}</div>
          <div className="text-sm text-muted-foreground mt-1">{config.label ?? yKey}</div>
        </div>
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
            {keys.map(k => <th key={k} className="text-left py-2 px-3">{k}</th>)}
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

export default function AiResearchAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [computing, setComputing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (question?: string) => {
    const q = question ?? input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const response = await api.aiQuery(q);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.summary ?? "Here are the results:",
        data: response,
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error processing that query. Try rephrasing your question.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompute = async () => {
    setComputing(true);
    try {
      await api.computeMetrics();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Behavioral metrics, network analysis, and churn predictions have been computed for all users. You can now query the latest data.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Failed to compute metrics. Please try again.",
      }]);
    } finally {
      setComputing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">AI Research Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">Ask questions about your data in plain English — get dynamic reports and visualizations</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">What would you like to know?</h2>
              <p className="text-sm text-muted-foreground mt-1">I can query your analytics database and generate charts from natural language</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(q)}
                  className="text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 text-sm transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="text-center">
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

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] space-y-3 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2" : ""}`}>
              <p className="text-sm">{msg.content}</p>
              {msg.data && msg.data.data && msg.data.data.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-4">
                  {msg.data.thinking && (
                    <p className="text-xs text-muted-foreground mb-3 italic">{msg.data.thinking}</p>
                  )}
                  <DynamicChart response={msg.data} />
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{msg.data.rowCount} row{msg.data.rowCount !== 1 ? "s" : ""}</span>
                    {msg.data.sql && (
                      <details className="cursor-pointer">
                        <summary className="hover:text-foreground">View SQL</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{msg.data.sql}</pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
              {msg.data?.error && (
                <p className="text-xs text-red-500 mt-1">Query error: {msg.data.error}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
              <p className="text-sm text-muted-foreground">Analyzing your question...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t pt-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="flex gap-2"
        >
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
