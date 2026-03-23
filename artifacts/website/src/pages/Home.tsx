import { motion } from "framer-motion";
import { ShieldCheck, Activity, Users, ArrowRight, EyeOff, MessageSquareX, Smartphone, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "Tether — Safe Messaging for Kids", description: "The first app that should come before all the others. A supervised messaging platform where children build real communication skills inside a community their parents trust." });

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative background image */}
        <div className="absolute inset-0 -z-10 w-full h-full opacity-60">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={STAGGER}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white glass-card text-primary font-bold text-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Accepting Waitlist for 2026 Cohort
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6">
            The first app. <br className="hidden sm:block" />
            <span className="italic text-primary font-normal">The one that should come before all the others.</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg sm:text-xl text-text-mid max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Tether is a supervised messaging platform where children build real communication skills inside a community their parents trust. Accountability is woven into the design — not bolted on.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 organic-shadow"
            >
              Join the Waitlist <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-text-light sm:hidden mt-2">No credit card required.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* DIFFERENTIATORS GRID */}
      <section className="py-24 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What makes it different</h2>
            <p className="text-text-mid text-lg">We didn't build a safer version of social media. We built a different category entirely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure by Design",
                desc: "No vanish mode. No unsend. No edit. The architecture structurally cannot do the things that cause harm — it removes the tools that enable them.",
                color: "bg-alert-1/10 text-alert-1"
              },
              {
                icon: Activity,
                title: "Graduated Trust",
                desc: "Privacy grows, safety never shrinks. Parents see every message initially, stepping back as children earn independence. Alerts remain active at all levels.",
                color: "bg-accent/10 text-accent"
              },
              {
                icon: Users,
                title: "The Trust Loop",
                desc: "Before two children can message, both parents introduce themselves. Kids connect within a network of adults who know each other.",
                color: "bg-primary/10 text-primary"
              }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-mid leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${import.meta.env.BASE_URL}images/organic-shapes.png`} alt="" className="w-full h-full object-cover filter brightness-0 invert" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="text-center pt-8 md:pt-0">
              <div className="text-6xl font-display font-bold mb-2">73%</div>
              <p className="text-primary-foreground/80 font-medium">of children aged 8-12 use messaging apps designed for adults</p>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-6xl font-display font-bold mb-2">0</div>
              <p className="text-primary-foreground/80 font-medium">major platforms give parents real-time visibility into conversations</p>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-6xl font-display font-bold mb-2">$2.8B</div>
              <p className="text-primary-foreground/80 font-medium">parental safety market largely unsolved at the communication layer</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE VANISH PROBLEM */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">They built disappearing on purpose.</h2>
              <p className="text-lg text-text-mid mb-8 leading-relaxed">
                Every major platform your child uses has a feature designed to make messages, photos, and videos leave no trace. This is not a bug. It is a product decision. And it is not fixable with parental controls.
              </p>
              
              <ul className="space-y-6">
                {[
                  { icon: EyeOff, title: "Snapchat", desc: "Built on disappearing. Messages vanish after viewing." },
                  { icon: Smartphone, title: "Instagram & TikTok", desc: "Vanish modes and engagement-optimized DMs between minors." },
                  { icon: MessageSquareX, title: "iMessage", desc: "Unsend within 2 minutes, edit within 15. Zero parent visibility." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                      <p className="text-text-mid">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-3xl blur-2xl -z-10" />
              <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-display font-bold mb-4 text-primary">Tether's Answer</h3>
                <p className="text-xl font-medium text-foreground mb-6">
                  "Disappearing messages are not a privacy feature. They are an accountability removal system."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-text-mid font-medium">No Vanish Mode. No unsend. No timer deletion.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-text-mid font-medium">No age bypass possible (parents own accounts).</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-text-mid font-medium">No unknown strangers sliding into DMs.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE BANNER */}
      <section className="py-24 bg-foreground text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <QuoteIcon className="w-12 h-12 text-primary mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-display font-light italic leading-tight mb-8">
            "You cannot teach a child to swim by keeping them out of the pool. You teach them in a pool you can see into, with someone you trust standing close."
          </h2>
          <button 
            onClick={() => setIsWaitlistOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-foreground font-bold hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Get Started Today
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
