import { motion } from "framer-motion";
import { School, ShieldCheck, FileText, Bell, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useSEO } from "@/hooks/useSEO";

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
                title: "Event-Only Notifications",
                desc: "When a serious alert fires (Level 4 or 5), the school receives a notification with a timestamp and severity level. Never message content. Never conversation history. Just a flag that something needs attention.",
              },
              {
                icon: FileText,
                title: "Documented Safety Record",
                desc: "Every alert, every notification, every parent acknowledgment is logged. If questions arise months later, the school has a documented safety record showing they were informed and when.",
              },
              {
                icon: ShieldCheck,
                title: "Zero Data Custody",
                desc: "Schools never access, store, or process student messages. Tether handles all content filtering and parent notification. The school's role is awareness, not surveillance.",
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
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">The school's problem</h2>
              <p className="text-lg text-text-mid mb-6 leading-relaxed">
                Cyberbullying between students often starts (or continues) outside school hours, on personal devices, through platforms the school has no visibility into. But when it spills into the classroom, the school is held responsible.
              </p>
              <p className="text-lg text-text-mid mb-8 leading-relaxed">
                Monitoring student communications creates FERPA and COPPA complications. Not monitoring them creates safety gaps. Schools need a third option.
              </p>
              <div className="space-y-4">
                {[
                  "No student data stored on school systems",
                  "No message content ever shared with school administrators",
                  "COPPA and FERPA compliant architecture",
                  "Parents control all settings — schools receive awareness only",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-text-mid font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-xl">
                <h3 className="text-2xl font-display font-bold mb-6 text-primary">How it works for schools</h3>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Letter of Intent", desc: "School signs an LOI expressing interest. No cost, no commitment." },
                    { step: "2", title: "Parent Opt-In", desc: "Parents who use Tether can optionally link their child's account to the school." },
                    { step: "3", title: "Event Alerts", desc: "School receives severity-level alerts for linked students. Timestamp and level only." },
                    { step: "4", title: "Safety Dashboard", desc: "Aggregate view of alert frequency and trends. No individual message access." },
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

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
