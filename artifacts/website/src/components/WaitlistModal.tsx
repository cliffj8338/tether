import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type WaitlistRole = "parent" | "school" | "church";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: WaitlistRole;
}

const ROLES: { value: WaitlistRole; label: string }[] = [
  { value: "parent", label: "Parent / Family" },
  { value: "school", label: "School Administrator" },
  { value: "church", label: "Church / Community Leader" },
];

const API_BASE = import.meta.env.DEV ? "" : "";

export function WaitlistModal({ isOpen, onClose, defaultRole = "parent" }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<WaitlistRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>("input, button");
      firstInput?.focus();
    }, 100);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, role }),
      });

      if (res.status === 409) {
        setError("This email is already on the waitlist.");
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSuccess(true);
      toast({
        title: "You're on the list!",
        description: "Keep an eye on your inbox for updates on Tether's launch.",
      });
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail("");
        setName("");
        setRole(defaultRole);
        setError("");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            aria-describedby="waitlist-desc"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden relative border border-border/50">
              <button
                onClick={onClose}
                aria-label="Close waitlist dialog"
                className="absolute top-4 right-4 p-2 text-text-light hover:text-foreground hover:bg-surface rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8 sm:p-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                
                <h2 id="waitlist-title" className="text-2xl sm:text-3xl font-bold mb-2">
                  Join the Founding Cohort
                </h2>
                <p id="waitlist-desc" className="text-text-mid mb-6">
                  Be among the first to experience a new standard of digital communication for children.
                </p>

                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-primary"
                  >
                    <CheckCircle2 className="w-16 h-16 mb-4" />
                    <p className="font-semibold text-lg text-center">Thanks for joining!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="waitlist-name" className="block text-sm font-semibold text-foreground mb-1">Name <span className="text-text-light font-normal">(optional)</span></label>
                      <input
                        id="waitlist-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-text-light"
                      />
                    </div>
                    <div>
                      <label htmlFor="waitlist-email" className="block text-sm font-semibold text-foreground mb-1">Email</label>
                      <input
                        id="waitlist-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-text-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">I am a...</label>
                      <div className="grid grid-cols-3 gap-2">
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-200",
                              role === r.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-surface text-text-mid hover:border-primary/30"
                            )}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {error && (
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2",
                        isSubmitting 
                          ? "bg-primary/70 cursor-not-allowed" 
                          : "bg-primary hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 organic-shadow"
                      )}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Join Waitlist"
                      )}
                    </button>
                  </form>
                )}
                <p className="text-xs text-text-light text-center mt-6">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
