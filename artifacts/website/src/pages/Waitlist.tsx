import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

type WaitlistRole = "parent" | "school" | "church";

const ROLES: { value: WaitlistRole; label: string; desc: string }[] = [
  { value: "parent", label: "Parent / Family", desc: "I want to sign up my family for Tether." },
  { value: "school", label: "School Administrator", desc: "I want to bring Tether to my school or district." },
  { value: "church", label: "Church / Community Leader", desc: "I want to bring Tether to my church or community group." },
];

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<WaitlistRole>("parent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const { toast } = useToast();

  useSEO({ title: "Join the Tether Waitlist", description: "Sign up for the founding cohort. Be among the first families, schools, and communities to experience Tether — the supervised messaging platform for kids." });

  useEffect(() => {
    fetch("/api/waitlist/count")
      .then(r => r.json())
      .then(data => {
        if (data.count > 50) setWaitlistCount(data.count);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, role }),
      });

      if (res.status === 409) {
        setError("This email is already on the waitlist.");
        setIsSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error("Failed");

      setIsSuccess(true);
      toast({
        title: "You're on the list!",
        description: "Keep an eye on your inbox for updates on Tether's launch.",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-20 px-4 min-h-[80vh] flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Join the Founding Cohort</h1>
            <p className="text-xl text-text-mid leading-relaxed">
              Be among the first families, schools, and communities to experience Tether.
            </p>
            {waitlistCount !== null && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-bold text-sm border border-border">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {waitlistCount}+ families already signed up
              </div>
            )}
          </motion.div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-border p-12 text-center shadow-lg"
            >
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold mb-4">You're on the list!</h2>
              <p className="text-text-mid text-lg">
                We'll be in touch as we approach our 2026 launch. Keep an eye on your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-border p-8 md:p-10 shadow-lg space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">I am a...</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "p-4 rounded-xl text-left border-2 transition-all duration-200",
                        role === r.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className="block font-bold text-sm">{r.label}</span>
                      <span className="block text-xs text-text-mid mt-1">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="w-name" className="block text-sm font-semibold text-foreground mb-1">Name <span className="text-text-light font-normal">(optional)</span></label>
                  <input
                    id="w-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all placeholder:text-text-light"
                  />
                </div>
                <div>
                  <label htmlFor="w-email" className="block text-sm font-semibold text-foreground mb-1">Email</label>
                  <input
                    id="w-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all placeholder:text-text-light"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2",
                  isSubmitting
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
                )}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Join the Waitlist <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <p className="text-xs text-text-light text-center">No spam. No credit card. Unsubscribe anytime.</p>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
