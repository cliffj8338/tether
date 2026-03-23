import { useState } from "react";
import { Check, Building2, HelpCircle } from "lucide-react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const FAQS = [
  {
    q: "Do I have to pay per child?",
    a: "No. The $9.99/month subscription covers your entire household. Add as many children and co-parents as you need."
  },
  {
    q: "Is there an Android version?",
    a: "Yes! Tether is launching simultaneously on iOS and Android to ensure your whole family can connect regardless of device preference."
  },
  {
    q: "Do you sell my child's data?",
    a: "Never. Our only business model is the family subscription. We do not run ads, and we do not sell behavioral data. Your privacy is structurally protected."
  },
  {
    q: "Can my child bypass it by creating a new account?",
    a: "No. Children cannot create Tether accounts. Every child profile must be created and linked by a verified parent account."
  }
];

export default function Pricing() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useSEO({ title: "Tether Pricing — $9.99/month Family Plan", description: "$9.99/month covers your entire family. No ads, no data sold. Compare Tether to device controls, monitoring apps, and in-app settings." });

  return (
    <div className="overflow-hidden">
      {/* HEADER */}
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">No Ads. No Data Sold. Ever.</h1>
          <p className="text-xl text-text-mid max-w-2xl mx-auto">
            You are the customer. Your child is not the product. We are entirely funded by family subscriptions.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* FAMILY PLAN CARD */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(107,158,138,0.2)] border-2 border-primary relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Most Common
            </div>
            <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
            <p className="text-text-mid mb-6">Everything you need to protect your household.</p>
            <div className="mb-8">
              <span className="text-5xl font-display font-bold">$9.99</span>
              <span className="text-text-mid">/month</span>
            </div>
            
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-colors mb-8"
            >
              Join the Waitlist
            </button>

            <ul className="space-y-4">
              {[
                "Unlimited children & parent accounts",
                "All 5 Graduated Trust Levels",
                "AI-powered content scanning",
                "Push & SMS emergency alerts",
                "Faith Mode access",
                "Permanent chat record (no vanish)"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SCHOOLS CARD */}
          <div className="bg-foreground rounded-3xl p-8 md:p-12 shadow-xl border border-foreground text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Schools & Organizations</h3>
              <p className="text-text-light mb-6 leading-relaxed">
                Protect your community. Schools get event-only notifications when a serious Level 5 alert fires — enough to act, without becoming data custodians of private messages.
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full py-4 bg-white text-foreground hover:bg-surface rounded-xl font-bold text-lg transition-colors"
              >
                Contact for Licensing
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">Why everything else fails</h2>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              
              <div className="p-8">
                <div className="text-sm font-bold text-destructive uppercase tracking-wider mb-2">Device Controls</div>
                <h4 className="text-xl font-bold mb-2">Blunt & Bypassable</h4>
                <p className="text-text-mid">Screen Time restricts entire apps indiscriminately. Children find bypasses on YouTube in 10 minutes.</p>
              </div>
              
              <div className="p-8">
                <div className="text-sm font-bold text-destructive uppercase tracking-wider mb-2">In-App Settings</div>
                <h4 className="text-xl font-bold mb-2">Fragmented & Performative</h4>
                <p className="text-text-mid">Managing 5 apps means 5 different control menus that change constantly. Vanish modes often can't be disabled.</p>
              </div>

              <div className="p-8 border-t border-border">
                <div className="text-sm font-bold text-destructive uppercase tracking-wider mb-2">Monitoring Apps</div>
                <h4 className="text-xl font-bold mb-2">Reactive & Corrosive</h4>
                <p className="text-text-mid">Tools like Bark scan what already happened. Surveillance is permanent with no path to earned trust.</p>
              </div>

              <div className="p-8 border-t border-border bg-primary/5">
                <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Tether</div>
                <h4 className="text-xl font-bold mb-2">Structural & Graduated</h4>
                <p className="text-text-mid">Built for the relationship. Harm is architecturally impossible, and independence is earned over time.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h2 className="text-3xl font-display font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="border border-border rounded-2xl overflow-hidden transition-colors hover:border-primary/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-lg bg-white"
                >
                  {faq.q}
                  <span className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-transform",
                    openFaq === i ? "border-primary text-primary rotate-180" : "border-border text-text-light"
                  )}>
                    ↓
                  </span>
                </button>
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-300 ease-in-out bg-surface/50",
                    openFaq === i ? "max-h-48 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
                  )}
                >
                  <p className="text-text-mid">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
