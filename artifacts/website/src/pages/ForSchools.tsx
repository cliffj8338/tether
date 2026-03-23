import { motion } from "framer-motion";
import { School, ShieldCheck, FileText, Bell, Users, ArrowRight, CheckCircle2, AlertTriangle, BarChart3, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const PERMISSION_ROWS = [
  { data: "Message content", child: true, parent: "Trust level", school: false, counselor: false },
  { data: "Contact list", child: true, parent: true, school: false, counselor: false },
  { data: "Trust level setting", child: false, parent: true, school: false, counselor: false },
  { data: "Alert notification (L1–3)", child: false, parent: true, school: false, counselor: false },
  { data: "Alert notification (L4–5)", child: false, parent: true, school: true, counselor: true },
  { data: "Alert timestamp & severity", child: false, parent: true, school: true, counselor: true },
  { data: "Flagged message content", child: false, parent: true, school: false, counselor: false },
  { data: "Aggregate safety metrics", child: false, parent: false, school: true, counselor: true },
  { data: "Individual student data", child: false, parent: true, school: false, counselor: false },
  { data: "Community-wide trends", child: false, parent: false, school: true, counselor: false },
];

export default function ForSchools() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "Tether for Schools — Digital Safety Partnership", description: "Give your school a documented digital safety record without becoming data custodians. Event-only alerts, no message access, COPPA compliant by design." });

  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-bold text-sm mb-6">
              <School className="w-4 h-4" /> For Schools & Districts
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Digital safety without the liability</h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-3xl mx-auto">
              Schools face an impossible position: responsible for student safety during digital communication, but with no tools to act on it and no appetite to monitor content. Tether solves both problems.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What schools get</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Enough information to act. None of the liability of being a data custodian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Bell,
                title: "Counselor Alert System",
                desc: "When a Level 4 or 5 alert fires, the school counselor receives a notification with a timestamp and severity level. Never message content. Never conversation history. Just a flag that something needs attention — and a documented record that the school was informed.",
              },
              {
                icon: FileText,
                title: "Duty-of-Care Documentation",
                desc: "Every alert, every notification, every parent acknowledgment is logged with timestamps. If questions arise months or years later, the school has a documented safety record proving they were informed and when they acted. This is the liability protection schools have been asking for.",
              },
              {
                icon: ShieldCheck,
                title: "Zero Data Custody",
                desc: "Schools never access, store, or process student messages. Tether handles all content filtering and parent notification. The school's role is awareness, not surveillance. No FERPA complications. No data breach risk from student communications.",
              },
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="bg-surface p-8 rounded-3xl border border-border"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-mid leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">School Safety Dashboard</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Aggregate visibility. Zero individual message access. The school sees trends and timestamps — never content.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-border shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="bg-foreground text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold">Tether School Dashboard</span>
                <span className="text-xs text-white/60 ml-2">Lincoln Middle School</span>
              </div>
              <span className="text-xs text-white/60">March 2026</span>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Active Students", value: "247", sub: "of 312 enrolled", color: "text-primary" },
                  { label: "Alerts This Month", value: "12", sub: "↓ 18% vs last month", color: "text-alert-3" },
                  { label: "Critical Alerts", value: "0", sub: "No L4/L5 this month", color: "text-primary" },
                  { label: "Parent Engagement", value: "94%", sub: "parents reviewed alerts", color: "text-accent" },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface rounded-xl p-4 text-center">
                    <div className={cn("text-3xl font-display font-bold", stat.color)}>{stat.value}</div>
                    <div className="text-sm font-semibold text-foreground mt-1">{stat.label}</div>
                    <div className="text-xs text-text-light mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-text-mid" />
                    <span className="font-bold text-sm">Alert Trend (6 months)</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[18, 22, 15, 19, 14, 12].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(v / 25) * 100}%` }}>
                          <div className="w-full bg-primary rounded-t" style={{ height: `${Math.min(100, (v / 25) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-text-light">{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-text-mid" />
                    <span className="font-bold text-sm">Recent Alerts</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { level: 2, time: "Mar 21, 2:14 PM", status: "Parent notified", dot: "bg-alert-2" },
                      { level: 1, time: "Mar 20, 11:30 AM", status: "Parent notified", dot: "bg-alert-1" },
                      { level: 3, time: "Mar 18, 3:45 PM", status: "Parent acknowledged", dot: "bg-alert-3" },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", alert.dot)} />
                          <span className="font-semibold">Level {alert.level}</span>
                        </div>
                        <span className="text-text-light">{alert.time}</span>
                        <span className="text-primary font-medium">{alert.status}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-light mt-3 text-center italic">No message content visible to school administrators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">Who Sees What</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              The permission architecture is designed so that each stakeholder sees exactly what they need — and nothing more.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="p-4 text-left font-bold uppercase tracking-wider text-text-light text-xs">Data Type</th>
                  <th className="p-4 text-center font-bold uppercase tracking-wider text-text-light text-xs">Child</th>
                  <th className="p-4 text-center font-bold uppercase tracking-wider text-text-light text-xs">Parent</th>
                  <th className="p-4 text-center font-bold uppercase tracking-wider text-text-light text-xs">School Admin</th>
                  <th className="p-4 text-center font-bold uppercase tracking-wider text-text-light text-xs">Counselor</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_ROWS.map((row, i) => (
                  <tr key={i} className={cn("border-b border-border last:border-b-0", i % 2 === 0 ? "bg-white" : "bg-surface/30")}>
                    <td className="p-4 font-medium text-foreground">{row.data}</td>
                    {[row.child, row.parent, row.school, row.counselor].map((val, j) => (
                      <td key={j} className="p-4 text-center">
                        {val === true ? (
                          <Eye className="w-4 h-4 text-primary mx-auto" />
                        ) : val === false ? (
                          <EyeOff className="w-4 h-4 text-text-light/40 mx-auto" />
                        ) : (
                          <span className="text-xs text-accent font-semibold">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">Why schools adopt Tether</h2>
              <div className="space-y-6">
                {[
                  { title: "Liability protection", desc: "Documented proof that the school was notified of safety events, with timestamps and parent acknowledgments. This is the duty-of-care evidence administrators need." },
                  { title: "Enrollment differentiator", desc: "Especially for faith schools: offering Tether as part of the school experience signals commitment to student safety and family values. It is a tangible answer to the question every prospective parent asks." },
                  { title: "Character evidence", desc: "Aggregate data on kindness moments, positive interactions, and trust level progression gives schools evidence of character development — not just academic performance." },
                  { title: "Counselor visibility", desc: "School counselors receive the alerts they need to intervene early — before a situation escalates to the point where it reaches the principal's office or the local news." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-text-mid text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-xl">
                <h3 className="text-2xl font-display font-bold mb-6 text-primary">How to get started</h3>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Letter of Intent", desc: "School signs an LOI expressing interest. No cost, no commitment, no procurement process required." },
                    { step: "2", title: "Parent Opt-In", desc: "Parents who use Tether can optionally link their child's account to the school. The school never initiates — parents do." },
                    { step: "3", title: "Event Alerts", desc: "School counselor receives severity-level alerts for linked students. Timestamp and level only. Never content." },
                    { step: "4", title: "Safety Dashboard", desc: "Aggregate view of alert frequency, trends, and parent engagement. Board-ready reporting included." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{item.title}</h4>
                        <p className="text-text-mid text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Designed for institutional adoption</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "District-Wide Deployment", desc: "One agreement covers an entire district. Parents opt in per child. Schools receive aggregate reporting." },
              { icon: ShieldCheck, title: "Compliance Ready", desc: "COPPA compliant. FERPA compatible. No student PII stored on school infrastructure. Built for the regulatory reality schools face." },
              { icon: FileText, title: "Board-Ready Documentation", desc: "We provide presentation materials, parent communication templates, and compliance documentation for school board approval." },
              { icon: School, title: "Pilot Programs", desc: "Start with a single school or grade. Measure impact. Scale when ready. No long-term contracts required for pilots." },
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={i}
                className="flex gap-4 p-6 rounded-2xl border border-border bg-surface"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-text-mid text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Bring Tether to your school</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            We're working with a founding group of schools and districts ahead of our 2026 launch. No cost to express interest. No obligation.
          </p>
          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2"
          >
            Request School Information <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} defaultRole="school" />
    </div>
  );
}
