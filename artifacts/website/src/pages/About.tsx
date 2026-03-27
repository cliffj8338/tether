import { useState } from "react";
import { motion } from "framer-motion";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Heart, Target, Star, CheckCircle, Code, BookOpen, Cpu } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function About() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "About Tether — Our Story", description: "Built by a father who couldn't find a safe place for his children to learn how to communicate online. Meet the founder behind the supervised messaging platform." });

  return (
    <div className="overflow-hidden">
      <section className="bg-foreground text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src={`${import.meta.env.BASE_URL}images/organic-shapes.jpg`} alt="" className="w-full h-full object-cover filter blur-3xl saturate-200" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Story</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Tether was not conceived in a boardroom. It was born from a&nbsp;father's frustration&nbsp;— and a&nbsp;family's&nbsp;faith.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative flex flex-col items-center gap-6">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-surface">
              <img src={`${import.meta.env.BASE_URL}images/cliff-headshot.jpg`} alt="Cliff Jurkiewicz, Founder of Tether" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold text-foreground">Cliff Jurkiewicz</h3>
              <p className="text-primary font-semibold mb-2">Founder, Tether</p>
              <p className="text-sm text-text-light mb-4">Top 1% LinkedIn &middot; AI Strategist &middot; Futurist &middot; Pilot &middot; Drummer</p>
              <a
                href="https://www.linkedin.com/in/cliffj/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#004182] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                linkedin.com/in/cliffj
              </a>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">The founder's journey</h2>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              Cliff's path to building Tether was not a straight line. As a father navigating his own recovery journey, he found that the principles of accountability, transparency, and community that rebuilt his life were the same principles missing from every digital platform his children would eventually use.
            </p>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              As employee #21 at Phenom, I operated as the VP of Global Strategy during its evolution from a startup into a $2 billion unicorn. That experience wasn't just about growth; it was about understanding the architecture required to scale enterprise HR tech at one of the fastest trajectories in the industry. The lessons learned in system-building and organizational capability at Phenom are the same principles I apply to the structural integrity of Tether.
            </p>
            <h3 className="text-xl font-heading font-bold text-text-dark mb-3">The Foundation of Tether</h3>
            <p className="text-lg text-text-mid mb-4 leading-relaxed">
              Tether wasn't born out of a career pivot, but out of necessity. It is the integration of three distinct tracks:
            </p>
            <ul className="text-lg text-text-mid mb-6 leading-relaxed space-y-2 pl-6 list-disc">
              <li><strong>Enterprise Scaling:</strong> The technical and strategic blueprint for building high-growth platforms.</li>
              <li><strong>Lived Experience:</strong> The reality of rebuilding trust and communication within a family after profound personal loss.</li>
              <li><strong>The Kyle's Wish Foundation:</strong> A commitment to honoring my son, Kyle, by creating tangible impact through purpose-driven work.</li>
            </ul>
            <h3 className="text-xl font-heading font-bold text-text-dark mb-3">Communication with Intent</h3>
            <p className="text-lg text-text-mid leading-relaxed">
              We built Tether because families deserve a digital environment where communication isn't left to chance. By weaving Christian values into the platform's core—not as a marketing layer, but as a functional feature—we've created a space where structure, safety, and grace are the default, providing children with a framework to learn how to interact with the world.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-text-light uppercase tracking-widest mb-8">Engineering & Leadership Background</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-display font-bold">FAST COMPANY</div>
            <div className="text-2xl font-sans font-black tracking-tighter">Nasdaq</div>
            <div className="text-2xl font-serif font-bold italic">MIT</div>
            <div className="text-2xl font-sans font-bold tracking-widest">CERN</div>
            <div className="text-2xl font-sans font-bold">NASA</div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why this matters now</h2>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              The gap between giving a child a phone and giving them access to platforms designed for adults is the most dangerous moment in modern parenting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "The lived experience advantage",
                desc: "Cliff has been on both sides — navigating accountability in his own life and watching his children approach the digital world. That dual perspective shapes every product decision. Tether isn't built by people studying the problem. It's built by someone who has lived it."
              },
              {
                icon: Code,
                title: "Enterprise engineering, startup speed",
                desc: "VP of Engineering at a unicorn HR tech company. Led platform infrastructure at scale. Worked with systems supporting millions of users. Now applying that discipline to the most important product: one that keeps children safe."
              },
              {
                icon: Heart,
                title: "Kyle's Wish Foundation",
                desc: "Named in honor of his son, Kyle's Wish Foundation reflects Cliff's commitment to children's welfare beyond technology. The same mission drives Tether: every child deserves adults who are paying attention."
              },
              {
                icon: BookOpen,
                title: "Faith as a foundation",
                desc: "For Cliff and his family, faith is not a feature — it's the reason the company exists. The conviction that children are worth protecting, that accountability builds character, and that communities thrive when adults take responsibility."
              },
              {
                icon: Cpu,
                title: "AI-assisted development advantage",
                desc: "Tether leverages AI-assisted development to move at startup speed with enterprise quality. Architectural decisions, content moderation, and code generation are accelerated by AI tooling — allowing a lean team to build and ship what would traditionally require a much larger engineering organization."
              },
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="bg-surface p-8 rounded-2xl border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-mid leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Star className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-display font-bold mb-12">Our Promises</h2>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-border">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">No algorithms</h4>
              <p className="text-text-mid text-sm">We do not optimize for engagement. We optimize for connection. There is no feed to scroll, no content to consume, no metric to maximize.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Parents own the data. Period.</h4>
              <p className="text-text-mid text-sm">Your child's personal data is visible only to you — not to Tether, not to admins, not to any third party. Not even the creators of Tether can see PII. Anonymized data may be used to improve safety, but it can never be traced to your child. Parents can export or delete at any time. COPPA compliant by architecture.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Built to guide, not spy</h4>
              <p className="text-text-mid text-sm">Parents decide what they see, when they see it, and how much independence their child earns. Trust levels grow. Privacy increases. The goal is not permanent surveillance — it is supervised independence, guided by the parent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Join the founding cohort.</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            We are building Tether with families, not for them. Join the founding cohort and help shape the future of safe messaging for children.
          </p>
          <button 
            onClick={() => setIsWaitlistOpen(true)}
            className="px-10 py-5 bg-white text-primary rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Join the Waitlist Today
          </button>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
