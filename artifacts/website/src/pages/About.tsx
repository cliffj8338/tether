import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Heart, Target, Code, Star, CheckCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function About() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  useSEO({ title: "About Tether — Our Story", description: "Built by a father who couldn't find a safe place for his children to learn how to communicate online. Meet the team behind the supervised messaging platform." });

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="bg-foreground text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src={`${import.meta.env.BASE_URL}images/organic-shapes.png`} alt="" className="w-full h-full object-cover filter blur-3xl saturate-200" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Story</h1>
          <p className="text-xl text-text-light leading-relaxed">
            Built by a father who couldn't find a safe place for his children to learn how to communicate online.
          </p>
        </div>
      </section>

      {/* CLIFF'S STORY */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface relative">
               <img src={`${import.meta.env.BASE_URL}images/family-abstract.png`} alt="Abstract parent and child illustration" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
          
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">The "Lived Experience" Advantage</h2>
            <p className="text-lg text-text-mid mb-6 leading-relaxed">
              Tether wasn't conceived in a boardroom. It was born out of frustration. As a father, our founder Cliff encountered the exact same problem millions of parents face: handing a child a smartphone with iMessage or Snapchat is like dropping them in the deep end of the ocean with no training.
            </p>
            <p className="text-lg text-text-mid mb-8 leading-relaxed">
              Before Tether, Cliff was employee #21 at Phenom People, helping scale it into a unicorn HR tech company as VP of Engineering. He left to build Kyle's Wish Foundation in honor of his son, and now brings his enterprise engineering expertise and deep lived experience to solve the digital safety crisis.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-2 font-bold text-foreground mb-2">
                  <Target className="w-5 h-5 text-primary" /> Proven Execution
                </div>
                <p className="text-sm text-text-mid">Former VP Engineering scaling complex platforms.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-foreground mb-2">
                  <Heart className="w-5 h-5 text-accent" /> Purpose Driven
                </div>
                <p className="text-sm text-text-mid">Building what his own family actually needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA STRIP */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-text-light uppercase tracking-widest mb-8">Engineering & Leadership Pedigree</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder logos using text for marketing site */}
            <div className="text-2xl font-display font-bold">FAST COMPANY</div>
            <div className="text-2xl font-sans font-black tracking-tighter">Nasdaq</div>
            <div className="text-2xl font-serif font-bold italic">MIT</div>
            <div className="text-2xl font-sans font-bold tracking-widest">CERN</div>
            <div className="text-2xl font-sans font-bold">NASA</div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Star className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-display font-bold mb-12">Our Promises</h2>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="bg-surface p-6 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">No algorithms</h4>
              <p className="text-text-mid text-sm">We don't optimize for engagement. We optimize for connection.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">No personal data sold</h4>
              <p className="text-text-mid text-sm">Your subscription pays the bills, not advertising networks.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">Built for parents</h4>
              <p className="text-text-mid text-sm">We give you the tools to guide, not just tools to spy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Join the movement.</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            We are looking for families to join our founding cohort. Help us shape the future of safe messaging.
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
