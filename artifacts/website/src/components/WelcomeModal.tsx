import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "tether_welcome_seen";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-foreground rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 md:p-10"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                      March 25, 2026
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight mb-4">
                    A jury just found Meta and YouTube liable for intentionally addicting a child.
                  </h2>

                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    $6 million in damages. Depression, body dysmorphia, suicidal thoughts — all linked to platform design choices. ~2,000 similar cases pending. A $375M penalty in New Mexico the day before.
                  </p>

                  <p className="text-white/50 text-xs leading-relaxed mb-6">
                    The platforms children use every day have been found liable for the harm they cause. The question is no longer whether they're dangerous — it's what we do about it.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <a
                      href="https://www.wsj.com/tech/meta-and-youtube-lose-landmark-social-media-trial-33e4c5cb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-medium transition-colors"
                    >
                      WSJ <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.reuters.com/legal/litigation/jury-reaches-verdict-meta-google-trial-social-media-addiction-2026-03-25/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-medium transition-colors"
                    >
                      Reuters <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    What can parents do? <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <svg viewBox="0 0 52 52" className="w-6 h-6">
                        <rect width="52" height="52" rx="12" fill="#6B9E8A" />
                        <circle cx="26" cy="26" r="5" fill="white" />
                        <line x1="26" y1="8" x2="26" y2="19.5" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                        <line x1="26" y1="32.5" x2="26" y2="44" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                        <line x1="8" y1="26" x2="19.5" y2="26" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                        <line x1="32.5" y1="26" x2="44" y2="26" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-primary font-bold text-sm">Tether is solving this.</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight mb-4">
                    The first messaging app built for kids — supervised by design.
                  </h2>

                  <div className="space-y-3 mb-6">
                    {[
                      "No vanish mode. No unsend. No disappearing.",
                      "Parents see every message — visibility calibrated to trust level.",
                      "Anti-addiction controls: time limits, message caps, \"Go Live\" prompts.",
                      "Not even Tether's creators can see your child's data.",
                      "AI-powered safety alerts for bullying, self-harm, and exploitation."
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={close}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Explore Tether <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
