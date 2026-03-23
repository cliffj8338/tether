import { motion } from "framer-motion";
import { ShieldAlert, Eye, Lock, HeartHandshake, ShieldCheck, UserCheck, Users, ArrowRight, Bell, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const TRUST_LEVELS = [
  { level: 1, title: "Full Oversight", desc: "Parent sees every message in real time. All conversations visible. All contacts require parent approval. This is where every child starts.", color: "bg-alert-1", text: "text-alert-1" },
  { level: 2, title: "Daily Digest", desc: "Real-time feed replaced by a daily summary. Parent still sees all messages, but as a digest rather than live. Alerts remain unchanged.", color: "bg-alert-2", text: "text-alert-2" },
  { level: 3, title: "Flagged Only", desc: "Normal conversations become private. Parent is only notified when the AI flags concerning content. Push notifications fire for all flagged items.", color: "bg-alert-3", text: "text-alert-3" },
  { level: 4, title: "Full Privacy", desc: "Full conversational privacy. Only crisis-level alerts reach the parent. Level 4 and 5 alerts trigger SMS to the parent's phone in addition to push notifications.", color: "bg-alert-4", text: "text-alert-4" },
  { level: 5, title: "Independence", desc: "Maximum independence. Only critical backstop alerts fire — self-harm, exploitation, or imminent danger. SMS always active for these events. The safety net never disappears.", color: "bg-alert-5", text: "text-alert-5" },
];

const ALERT_LEVELS = [
  { level: 1, title: "Soft Flag", desc: "Minor tone or language issue. Logged for parent review. In-app note only.", notification: "In-app note", color: "bg-alert-1", border: "border-alert-1/30" },
  { level: 2, title: "Mild Concern", desc: "Mild unkindness, social pressure, or exclusionary language. Push notification to parent.", notification: "Push notification", color: "bg-alert-2", border: "border-alert-2/30" },
  { level: 3, title: "Unkind Behavior", desc: "Targeted bullying, repeated harassment, or deliberate cruelty. Push notification with conversation context.", notification: "Push notification", color: "bg-alert-3", border: "border-alert-3/30" },
  { level: 4, title: "Serious Threat", desc: "Explicit threats, grooming patterns, sharing personal information with unknown contacts, or predatory behavior.", notification: "Push + SMS", color: "bg-alert-4", border: "border-alert-4/30" },
  { level: 5, title: "Critical — Immediate Action", desc: "Self-harm language, suicidal ideation, sexual exploitation, or imminent physical danger. Simultaneous alerts to all connected parents.", notification: "Push + SMS + both families", color: "bg-alert-5", border: "border-alert-5/30" },
];

export default function HowItWorks() {
  useSEO({ title: "How Tether Works — Trust Levels & Safety", description: "Five graduated trust levels, AI-powered content filtering, the Trust Loop contact approval system, and Secure by Design architecture. Learn how Tether keeps kids safe while teaching responsible communication." });
  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">How Tether Works</h1>
          <p className="text-xl text-text-mid leading-relaxed">
            A structured environment where children practice real communication with real stakes, before they ever encounter a platform designed to exploit them.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alert-1/10 text-alert-1 font-bold text-sm mb-4">
              <ShieldCheck className="w-4 h-4" /> Core Philosophy
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Secure by Design</h2>
            <p className="text-lg text-text-mid max-w-3xl mx-auto">
              Most platforms add safety features on top of architecture designed for engagement. Tether is different — the architecture itself structurally prevents harm. You cannot build what doesn't exist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { title: "No Vanish Mode", desc: "Messages cannot disappear. There is no timer, no unsend, no edit. What is said is permanent and visible." },
              { title: "No Unknown Contacts", desc: "Every connection requires mutual parent approval. Strangers cannot message children. Period." },
              { title: "No Algorithmic Feed", desc: "No engagement optimization. No trending content. No suggested contacts. Communication only." },
              { title: "No Data Monetization", desc: "Subscription-funded. No ads. No data brokering. No third-party tracking. COPPA compliant from the ground up." },
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={i}
                className="bg-surface p-6 rounded-2xl border border-border"
              >
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-text-mid text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Graduated Trust System</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Five levels from full oversight to full independence. Privacy grows as children demonstrate responsible behavior. Safety never shrinks — the alert system remains active at every level.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[27px] top-8 bottom-8 w-1 bg-white md:left-1/2 md:-ml-[2px]" />
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
                    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <h3 className={cn("text-xl font-bold mb-2", level.text)}>{level.title}</h3>
                      <p className="text-text-mid text-sm leading-relaxed">{level.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

            <div className="w-full max-w-[320px] bg-foreground rounded-[40px] p-4 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                <div className="w-24 h-4 bg-black rounded-b-xl" />
              </div>
              <div className="h-[600px] bg-background rounded-[32px] overflow-hidden flex flex-col border border-foreground/50">
                <div className="bg-white p-4 border-b text-foreground font-bold flex flex-col items-center mt-4">
                  <span>Olivia + Emma</span>
                  <span className="text-xs text-text-light font-normal">23 messages · 2 kind moments</span>
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

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">The Trust Loop</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Before two children can message, both parents approve the connection. No cold requests. No stranger DMs. Every friendship is verified by the adults responsible for both children.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              {[
                { step: 1, icon: UserCheck, title: "Parent A Initiates", desc: "Parent sends a contact request with their name, phone, and email to Parent B." },
                { step: 2, icon: Users, title: "Parent B Reviews", desc: "Parent B sees who is requesting and decides whether to accept the connection." },
                { step: 3, icon: MessageCircle, title: "Both Approve", desc: "Once both parents confirm, the children can see each other in their contact list." },
                { step: 4, icon: HeartHandshake, title: "Kids Connect", desc: "Children message freely within the approved network. Both parents can monitor per their trust level." },
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  key={i}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-primary/20">
                      <ArrowRight className="w-4 h-4 text-primary/40 absolute -right-2 -top-[7px]" />
                    </div>
                  )}
                  <div className="text-xs font-bold text-primary mb-1">Step {item.step}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-text-mid text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-surface border border-border rounded-2xl p-8 text-center">
              <p className="text-text-mid leading-relaxed">
                <span className="font-bold text-foreground">The result:</span> every child's contact list is a network of families who know each other — mirroring how friendships work in the physical world. No anonymous accounts. No strangers. No surprise DMs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Five-Level Alert System</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              AI-powered content filtering analyzes every message in two passes — instant pattern matching plus contextual AI analysis. Alerts are graduated by severity so parents always know the urgency.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {ALERT_LEVELS.map((alert, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={alert.level}
                className={cn(
                  "flex gap-4 p-5 rounded-xl border bg-white transition-colors",
                  alert.border,
                  alert.level >= 4 && "ring-1 ring-inset",
                  alert.level === 4 && "ring-alert-4/20",
                  alert.level === 5 && "ring-alert-5/30 bg-alert-5/5"
                )}
              >
                <div className={cn("w-4 h-4 rounded-full mt-1 flex-shrink-0", alert.color, alert.level === 5 && "animate-pulse")} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <span className="font-bold">Level {alert.level}: {alert.title}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-surface text-text-mid whitespace-nowrap flex items-center gap-1">
                      {alert.level >= 4 ? <Phone className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                      {alert.notification}
                    </span>
                  </div>
                  <p className="text-text-mid text-sm">{alert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-8 p-4 bg-white border border-border rounded-xl text-center">
            <p className="text-sm text-text-mid">
              <span className="font-bold text-foreground">Two-pass analysis:</span> First pass uses instant pattern matching for profanity and explicit content. Second pass uses Claude AI for contextual analysis — catching subtle bullying, grooming patterns, social manipulation, and peer pressure that keyword filters miss.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="bg-faith-gold-bg border border-faith-gold-border p-8 md:p-12 rounded-3xl">
                <div className="w-12 h-12 bg-faith-gold/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🕊️</span>
                </div>
                <h2 className="text-3xl font-display font-bold mb-4 text-faith-gold">Faith Mode</h2>
                <p className="text-text-mid leading-relaxed mb-6">
                  An optional toggle for Christian families. When enabled, the AI content filter adds faith-aware analysis — evaluating conversations through the lens of values like kindness, honesty, and respect. Not a generic filter. A foundation aligned with how your family already lives.
                </p>
                <ul className="space-y-3 text-sm font-semibold text-faith-gold">
                  <li className="flex items-center gap-2">✓ Value-aligned AI moderation calibrated for Protestant and Evangelical communities</li>
                  <li className="flex items-center gap-2">✓ Scripture-based daily prompts in conversations</li>
                  <li className="flex items-center gap-2">✓ Specialized emoji sets aligned with community values</li>
                  <li className="flex items-center gap-2">✓ Per-child toggle — enable for individual children, not the whole family</li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-bold mb-4">Built for families of faith</h2>
              <p className="text-lg text-text-mid leading-relaxed mb-6">
                Faith Mode isn't a marketing checkbox. It was built by a founder whose faith is central to his family's life. The moderation layer understands the difference between secular safety and values-aligned guidance.
              </p>
              <p className="text-text-mid leading-relaxed">
                When Faith Mode is on, the AI doesn't just flag harmful content — it recognizes when a conversation drifts away from the values a family holds. Gossip, dishonesty, pride, disrespect to authority. These aren't crisis alerts, but they matter to parents who are raising children with intention.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
