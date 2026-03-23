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
           <img src={`${import.meta.env.BASE_URL}images/organic-shapes.png`} alt="" className="w-full h-full object-cover filter blur-3xl saturate-200" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Story</h1>
          <p className="text-xl text-text-light leading-relaxed">
            Tether was not conceived in a boardroom. It was born from a father's frustration — and a family's faith.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface relative">
               <img src={`${import.meta.env.BASE_URL}images/family-abstract.png`} alt="Abstract parent and child illustration" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
          
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">The founder's journey</h2>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              Cliff's path to building Tether was not a straight line. As a father navigating his own recovery journey, he found that the principles of accountability, transparency, and community that rebuilt his life were the same principles missing from every digital platform his children would eventually use.
            </p>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              Before Tether, Cliff was employee #21 at Phenom People, helping scale it from startup to unicorn as VP of Engineering. He led infrastructure supporting millions of users across enterprise HR platforms. He left that career to honor his son Kyle, founding Kyle's Wish Foundation.
            </p>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              His faith is central to his family's life — and central to the product. Faith Mode exists because Cliff built the tool his own family needed: one where Christian values are not an afterthought, but a first-class feature woven into every layer of the platform.
            </p>
            <p className="text-lg text-text-mid leading-relaxed">
              Tether brings together three threads: enterprise engineering experience at scale, the lived experience of a parent rebuilding trust within his own family, and a deep conviction that children deserve a place to learn communication with structure, safety, and grace.
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
              <h4 className="font-bold text-lg mb-2">No data sold. Ever.</h4>
              <p className="text-text-mid text-sm">Your subscription pays the bills. No advertising networks. No data brokers. No third-party tracking. COPPA compliant by architecture, not by policy patch.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Built to guide, not spy</h4>
              <p className="text-text-mid text-sm">We give parents tools to teach. Trust levels grow. Privacy increases. The goal is not permanent surveillance — it is supervised independence.</p>
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
