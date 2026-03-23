import { motion } from "framer-motion";
import { Heart, ShieldCheck, BookOpen, MessageCircle, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

const COMPARISON = [
  { feature: "AI content moderation", standard: "Harmful content detection: bullying, threats, grooming, exploitation", faith: "All standard protections plus values-aligned analysis: gossip, dishonesty, disrespect to authority, pride" },
  { feature: "Conversation prompts", standard: "Kindness and respect-focused prompts", faith: "Scripture-based daily prompts drawn from Protestant/Evangelical tradition" },
  { feature: "Emoji sets", standard: "Full standard emoji set with age-appropriate filtering", faith: "Curated emoji taxonomy aligned with community values" },
  { feature: "Alert sensitivity", standard: "5-level alert system based on safety severity", faith: "Same 5-level system with additional sensitivity to faith-relevant behavioral patterns" },
  { feature: "Community ceiling", standard: "Trust levels set by individual parents", faith: "Community operator can set minimum trust levels and default moderation standards" },
  { feature: "Per-child toggle", standard: "Always active", faith: "Can be enabled or disabled per child — not all-or-nothing for the family" },
];

export default function FaithMode() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "Faith Mode — Values-Aligned Messaging for Christian Families", description: "Faith Mode is not a filter. It's a foundation. Tether's dedicated mode for Christian Protestant and Evangelical communities brings values-aligned moderation, scripture prompts, and curated content." });

  return (
    <div className="overflow-hidden">
      <section className="bg-faith-gold-bg py-20 px-4 border-b border-faith-gold-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-faith-gold font-bold text-sm mb-6 border border-faith-gold-border">
              🕊️ Faith Mode
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Not a filter. A foundation.</h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-3xl mx-auto">
              Faith Mode is Tether's dedicated experience for Christian Protestant and Evangelical communities. It doesn't just remove harmful content — it reinforces the values your family already lives.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What Faith Mode changes</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Every safety feature in Standard Mode remains active. Faith Mode adds a values layer on top — it never removes protections, only deepens them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Values-aligned moderation",
                desc: "The AI content filter adds faith-aware analysis. Beyond safety threats, it recognizes when conversations drift toward gossip, dishonesty, disrespect, or pride — patterns that matter to families raising children with intention.",
              },
              {
                icon: BookOpen,
                title: "Scripture integration",
                desc: "Daily conversation prompts drawn from Scripture. Not intrusive — a gentle presence that mirrors what families teach at home and what churches reinforce on Sunday. Children see faith woven into their daily communication.",
              },
              {
                icon: Sparkles,
                title: "Curated content & emoji",
                desc: "Emoji sets aligned with community values. Content categories calibrated for families who take those values seriously. Not a stripped-down version of the standard experience — a differently calibrated one.",
              },
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="bg-faith-gold-bg p-8 rounded-3xl border border-faith-gold-border"
              >
                <div className="w-14 h-14 rounded-2xl bg-faith-gold/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-faith-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-mid leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">Standard Mode vs. Faith Mode</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Same platform. Same safety. Different depth.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-surface border-b border-border">
              <div className="p-4 font-bold text-sm uppercase tracking-wider text-text-light">Feature</div>
              <div className="p-4 font-bold text-sm uppercase tracking-wider text-primary border-l border-border">Standard Mode</div>
              <div className="p-4 font-bold text-sm uppercase tracking-wider text-faith-gold border-l border-border">Faith Mode</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className={cn("grid grid-cols-3 border-b border-border last:border-b-0", i % 2 === 0 ? "bg-white" : "bg-surface/50")}>
                <div className="p-4 font-semibold text-sm text-foreground">{row.feature}</div>
                <div className="p-4 text-sm text-text-mid border-l border-border">{row.standard}</div>
                <div className="p-4 text-sm text-text-mid border-l border-border bg-faith-gold-bg/50">{row.faith}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">Built by a family of faith</h2>
              <p className="text-lg text-text-mid leading-relaxed mb-6">
                Faith Mode was not built by a product team studying the Christian market. It was built by a founder whose faith is central to his family's daily life — a father who wanted his own children to have a digital space that reflected the values they practice at home and at church.
              </p>
              <p className="text-lg text-text-mid leading-relaxed mb-6">
                The moderation layer understands the difference between secular safety and values-aligned guidance. It knows the difference between a child being unkind and a child being dishonest. Between a conversation that drifts and one that contradicts what a family believes. These distinctions matter to parents raising children with intention.
              </p>
              <p className="text-text-mid leading-relaxed">
                Faith Mode is not a marketing feature. It is the reason the company exists.
              </p>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-foreground text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-faith-gold/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <MessageCircle className="w-10 h-10 text-faith-gold mb-6" />
                  <h3 className="text-2xl font-display font-bold mb-6">What it looks like in practice</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm font-bold text-faith-gold mb-1">Scripture Prompt</p>
                      <p className="text-sm text-white/80 italic">"Be kind to one another, tenderhearted, forgiving one another..." — Ephesians 4:32</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm font-bold text-primary mb-1">Kind Moment Detected</p>
                      <p className="text-sm text-white/80">Olivia encouraged Emma during a difficult conversation. Logged as a positive interaction.</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm font-bold text-alert-2 mb-1">Faith-Aware Flag</p>
                      <p className="text-sm text-white/80">Conversation pattern identified: gossip about a classmate. Soft flag sent to parent. Not a safety event — a values event.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-faith-gold-bg border-t border-faith-gold-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">For schools and organizations</h2>
          <p className="text-lg text-text-mid max-w-2xl mx-auto mb-12">
            Faith schools, churches, and community organizations can set Faith Mode as the default for every family in their group. Individual parents retain full control — but the community provides the foundation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            {[
              "Community operator sets Faith Mode as default",
              "Individual parents can adjust per child",
              "Community-wide moderation standards",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-4 border border-faith-gold-border">
                <CheckCircle2 className="w-5 h-5 text-faith-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-text-mid">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-faith-gold text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Experience Faith Mode</h2>
          <p className="text-xl text-white/90 mb-10">
            Join the founding cohort and be among the first families to use a messaging platform designed around the values you already live.
          </p>
          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-faith-gold rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2"
          >
            Join the Waitlist <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
