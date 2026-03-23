import { motion } from "framer-motion";
import { Church, Users, Heart, Shield, BookOpen, ArrowRight, CheckCircle2, Music, GraduationCap, Dumbbell } from "lucide-react";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useSEO } from "@/hooks/useSEO";

export default function ForChurches() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "Tether for Churches & Communities — Faith-First Messaging", description: "Give your congregation, youth group, or community a supervised messaging platform with Faith Mode as the default. Tether is built for the values your community already lives." });

  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-faith-gold-bg text-faith-gold font-bold text-sm mb-6 border border-faith-gold-border">
              <Church className="w-4 h-4" /> For Churches & Communities
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">A platform your congregation can trust</h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-3xl mx-auto">
              Youth groups, church families, and faith communities need a digital space that reflects their values — not a secular platform with a Christian sticker on top. Tether was built for this.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">The community operator model</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              A church leader, youth pastor, or community organizer becomes the community operator — setting the tone, defaults, and values for everyone in the group.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Faith Mode as Default",
                desc: "When a church sets up Tether for their community, Faith Mode is enabled by default for every family. Scripture prompts, values-aligned moderation, and faith-aware content analysis are active from day one.",
              },
              {
                icon: Shield,
                title: "Community-Level Settings",
                desc: "The community operator can set minimum trust levels, approve community-wide contacts, and define the moderation standards. Parents retain full control over their own children — the community provides the floor.",
              },
              {
                icon: Users,
                title: "Built-In Parent Network",
                desc: "Every family in the community is already connected through the Trust Loop. Youth group parents know each other. Their children can message freely within a pre-approved network of families who share the same values.",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Use cases</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Tether works for any community where adults are responsible for children's digital communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Church,
                title: "Youth Groups & Congregations",
                desc: "The primary use case. Youth pastors can coordinate events, share devotionals, and let kids communicate — all within a platform that reinforces the values taught on Sunday morning. Parents see what they need to see. The youth pastor gets aggregate visibility without reading messages.",
                highlight: true,
              },
              {
                icon: GraduationCap,
                title: "Christian & Faith Schools",
                desc: "Faith schools can combine the institutional safety features with Faith Mode defaults. The school receives event-only alerts. Parents retain full control. The platform reinforces the school's mission without the school becoming a data custodian.",
                highlight: false,
              },
              {
                icon: Dumbbell,
                title: "Sports Leagues & Clubs",
                desc: "Travel teams, rec leagues, and organized sports involve parents, coaches, and kids who need to communicate. Tether provides a supervised channel where coaches can coordinate and kids can connect — with every parent in the loop.",
                highlight: false,
              },
              {
                icon: Music,
                title: "Homeschool Co-ops & After-School Programs",
                desc: "Homeschool families and after-school programs operate like small communities. Tether gives them a shared communication platform where every family knows every other family, and the co-op leader can set community-wide standards.",
                highlight: false,
              },
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={i}
                className={`p-8 rounded-3xl border ${feature.highlight ? "bg-faith-gold-bg border-faith-gold-border ring-1 ring-faith-gold/20" : "bg-white border-border"}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.highlight ? "bg-faith-gold/20" : "bg-primary/10"}`}>
                  <feature.icon className={`w-7 h-7 ${feature.highlight ? "text-faith-gold" : "text-primary"}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-mid leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">How it works for your community</h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Community setup", desc: "Church leader or youth pastor creates the community. Faith Mode is enabled by default. Community code is generated for families to join." },
                  { step: "2", title: "Families join", desc: "Parents download Tether, enter the community code, and create family accounts. Their children are immediately connected to other families in the community." },
                  { step: "3", title: "Community connection", desc: "Kids can message other kids in the community. Parents see conversations at their trust level. The community leader sees aggregate safety metrics — never individual messages." },
                  { step: "4", title: "Values reinforced", desc: "Faith Mode's AI moderation evaluates conversations through the lens of Christian values. Scripture prompts appear in conversations. The digital space reinforces what's taught at church." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-faith-gold text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
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

            <div className="lg:w-1/2">
              <div className="bg-faith-gold-bg border-2 border-faith-gold-border rounded-3xl p-8 md:p-10">
                <div className="w-12 h-12 bg-faith-gold/20 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-faith-gold" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-faith-gold">Org licensing</h3>
                <p className="text-text-mid leading-relaxed mb-6">
                  Churches and communities can license Tether for their congregation at a group rate. Individual families don't need separate subscriptions when they join through their community.
                </p>
                <div className="space-y-3">
                  {[
                    "Group pricing for congregations of any size",
                    "Single community code for easy family onboarding",
                    "Community operator dashboard with aggregate metrics",
                    "Faith Mode enabled by default for all families",
                    "No message content ever visible to community leaders",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-faith-gold flex-shrink-0" />
                      <span className="text-sm text-text-mid font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-faith-gold text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Bring Tether to your community</h2>
          <p className="text-xl text-white/90 mb-10">
            We're working with a founding group of churches and communities ahead of our 2026 launch. No cost to express interest. No obligation.
          </p>
          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-faith-gold rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2"
          >
            Request Community Information <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} defaultRole="church" />
    </div>
  );
}
