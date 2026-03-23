import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Link as LinkIcon, ChevronDown } from "lucide-react";
import { WaitlistModal } from "../WaitlistModal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const NAV_LINKS: NavLink[] = [
  { href: "/how-it-works", label: "How It Works" },
  {
    href: "/for-schools",
    label: "Solutions",
    children: [
      { href: "/for-schools", label: "For Schools" },
      { href: "/for-churches", label: "For Churches" },
      { href: "/faith-mode", label: "Faith Mode" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

function DesktopDropdown({ link, location }: { link: NavLink; location: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isActive = link.children?.some((c) => location === c.href);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={cn(
          "text-sm font-semibold transition-colors hover:text-primary flex items-center gap-1",
          isActive ? "text-primary" : "text-text-mid"
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {link.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl border border-border shadow-xl overflow-hidden z-50"
          >
            {link.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-semibold transition-colors hover:bg-surface",
                  location === child.href ? "text-primary bg-primary/5" : "text-foreground"
                )}
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/80 backdrop-blur-lg border-border/50 shadow-sm py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-display font-bold text-primary group"
            >
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <LinkIcon className="w-4 h-4" />
              </div>
              <span className="tracking-tight">Tether</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <DesktopDropdown key={link.href} link={link} location={location} />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-semibold transition-colors hover:text-primary",
                      location === link.href ? "text-primary" : "text-text-mid"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 organic-shadow"
              >
                Join Waitlist
              </button>
            </nav>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[60px] left-0 right-0 bg-white border-b border-border/50 shadow-xl z-30 md:hidden overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl text-lg font-semibold transition-colors",
                        link.children.some((c) => location === c.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-surface"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform", mobileExpanded === link.label && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 py-1 space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block px-4 py-2.5 rounded-lg text-base font-medium transition-colors",
                                  location === child.href ? "text-primary bg-primary/5" : "text-text-mid hover:bg-surface"
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-lg font-semibold transition-colors",
                      location === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-surface"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWaitlistOpen(true);
                }}
                className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold text-lg"
              >
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}
