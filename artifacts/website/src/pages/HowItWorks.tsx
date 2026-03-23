import { motion } from "framer-motion";
import { ShieldAlert, Eye, MessageCircle, Lock, Bell, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const TRUST_LEVELS = [
  { level: 1, title: "Full Oversight", desc: "Parent sees all messages in real time.", color: "bg-alert-1", text: "text-alert-1" },
  { level: 2, title: "Daily Digest", desc: "Daily digest replaces real-time. Alerts unchanged.", color: "bg-alert-2", text: "text-alert-2" },
  { level: 3, title: "Flagged Only", desc: "Parent notified of flagged content only. Normal chats private.", color: "bg-alert-3", text: "text-alert-3" },
  { level: 4, title: "Full Privacy", desc: "Full privacy. Crisis alerts and Level 5 SMS always active.", color: "bg-alert-4", text: "text-alert-4" },
  { level: 5, title: "Independence", desc: "Maximum independence. Only critical backstop alerts fire.", color: "bg-alert-5", text: "text-alert-5" },
];

export default function HowItWorks() {
  useSEO({ title: "How Tether Works — Trust Levels & Safety", description: "Five graduated trust levels, AI-powered content filtering, and the Trust Loop contact approval system. Learn how Tether keeps kids safe while teaching responsible communication." });
  return (
    <div className="overflow-hidden">
      {/* HEADER */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">How Tether Works</h1>
          <p className="text-xl text-text-mid leading-relaxed">
            A structured environment where children practice real communication with real stakes, before they ever encounter a platform designed to exploit them.
          </p>
        </div>
      </section>

      {/* TRUST LEVELS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Graduated Trust System</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Privacy grows, safety never shrinks. The transition from zero access to an unmonitored smartphone shouldn't be a cliff.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[27px] top-8 bottom-8 w-1 bg-surface md:left-1/2 md:-ml-[2px]" />
            <div className="space-y-12">
              {TRUST_LEVELS.map((level, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={level.level} 
                  className={cn(
                    "relative flex items-center md:justify-between",
                    i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                  )}
                >
                  <div className="md:w-1/2" />
                  
                  <div className={cn(
                    "absolute left-0 md:left-1/2 -ml-0 md:-ml-6 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center font-bold text-white z-10 shadow-lg",
                    level.color
                  )}>
                    L{level.level}
                  </div>

                  <div className="ml-20 md:ml-0 md:w-1/2 md:px-12">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <h3 className={cn("text-xl font-bold mb-2", level.text)}>{level.title}</h3>
                      <p className="text-text-mid">{level.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TWO PERSPECTIVES */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0">
           <img src={`${import.meta.env.BASE_URL}images/organic-shapes.png`} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Same Conversation. Two Perspectives.</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              The child sees a normal chat. The parent sees everything — including the message that never arrived.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Child Phone */}
            <div className="w-full max-w-[320px] bg-white rounded-[40px] p-4 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                <div className="w-24 h-4 bg-black rounded-b-xl" />
              </div>
              <div className="h-[600px] bg-background rounded-[32px] overflow-hidden flex flex-col border border-border">
                <div className="bg-white p-4 border-b text-foreground font-bold flex items-center justify-center mt-4">Emma</div>
                <div className="p-4 flex-grow space-y-4">
                  <div className="bg-surface text-text-mid text-xs p-2 rounded-lg text-center mx-4 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-primary" /> "Be kind to one another..."
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-surface text-foreground px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">Want to work on science tonight?</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">Yes!! You are the best 😊</div>
                  </div>
                </div>
                <div className="p-4 bg-white border-t">
                  <div className="bg-surface rounded-full px-4 py-2 text-text-light text-sm">Message Emma...</div>
                </div>
              </div>
              <div className="absolute -bottom-6 inset-x-0 text-center text-primary-foreground font-bold text-xl">
                Child View
              </div>
            </div>

            {/* Parent Phone */}
            <div className="w-full max-w-[320px] bg-foreground rounded-[40px] p-4 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                <div className="w-24 h-4 bg-black rounded-b-xl" />
              </div>
              <div className="h-[600px] bg-background rounded-[32px] overflow-hidden flex flex-col border border-foreground/50">
                <div className="bg-white p-4 border-b text-foreground font-bold flex flex-col items-center mt-4">
                  <span>Olivia + Emma</span>
                  <span className="text-xs text-text-light font-normal">23 messages • 2 kind moments</span>
                </div>
                <div className="p-4 flex-grow space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-surface text-foreground px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">Want to work on science tonight?</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">Yes!! You are the best 😊</div>
                  </div>
                  <div className="flex justify-start relative">
                    <div className="bg-alert-4/20 text-foreground px-4 py-2 rounded-2xl rounded-tl-none border border-alert-4 border-dashed max-w-[80%] opacity-70">
                      [Blocked Profanity Attempt]
                    </div>
                    <ShieldAlert className="absolute -left-2 -top-2 w-5 h-5 text-alert-4" />
                  </div>
                </div>
                <div className="p-4 bg-white border-t">
                  <div className="bg-surface rounded-full px-4 py-2 text-text-light text-sm flex justify-between">
                    Add private note...
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 inset-x-0 text-center text-primary-foreground font-bold text-xl">
                Parent View
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALERT SYSTEM & FAITH MODE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">The Alert System</h2>
            <p className="text-text-mid mb-8">
              Alerts are graduated by severity. No forensic review after the fact — the right people know in real time, every time.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4 p-4 rounded-xl border border-border/50 hover:border-alert-1/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-alert-1 mt-1.5 flex-shrink-0" />
                <div><span className="font-bold">Level 1: Soft Flags.</span> Tone analysis and minor behavioral corrections. In-app note.</div>
              </li>
              <li className="flex gap-4 p-4 rounded-xl border border-border/50 hover:border-alert-3/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-alert-3 mt-1.5 flex-shrink-0" />
                <div><span className="font-bold">Level 3: Unkind Behavior.</span> Bullying or targeted language. Push notification to parent.</div>
              </li>
              <li className="flex gap-4 p-4 bg-alert-5/5 rounded-xl border border-alert-5/20 hover:border-alert-5/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-alert-5 mt-1.5 flex-shrink-0 animate-pulse" />
                <div><span className="font-bold text-alert-5">Level 5: Critical.</span> Self-harm, exploitation. Immediate simultaneous SMS to families.</div>
              </li>
            </ul>
          </div>
          
          <div className="bg-faith-gold-bg border border-faith-gold-border p-8 md:p-12 rounded-3xl">
            <div className="w-12 h-12 bg-faith-gold/20 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🕊️</span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-faith-gold">Faith Mode</h2>
            <p className="text-text-mid leading-relaxed mb-6">
              A dedicated Faith Mode supports Christian Protestant and Evangelical communities — curated content, emoji sets aligned with community values, moderation calibrated for families who take those values seriously. Not a filter. A foundation.
            </p>
            <ul className="space-y-2 text-sm font-semibold text-faith-gold">
              <li className="flex items-center gap-2">✓ Value-aligned moderation</li>
              <li className="flex items-center gap-2">✓ Scripture prompt integration</li>
              <li className="flex items-center gap-2">✓ Specialized emoji taxonomy</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
