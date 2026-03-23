import { Link } from "wouter";
import { LinkIcon, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-display font-bold text-primary mb-4">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
                <LinkIcon className="w-4 h-4" />
              </div>
              <span className="tracking-tight">Tether</span>
            </Link>
            <p className="text-text-mid max-w-sm mb-6 font-medium leading-relaxed">
              Messaging for kids. Supervised by design. Built for trust. The first app that should come before all the others.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Follow Tether on Twitter" className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-mid hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Follow Tether on Instagram" className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-mid hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Follow Tether on LinkedIn" className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-mid hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/how-it-works" className="text-text-mid hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="text-text-mid hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-text-mid hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-mid hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-mid hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-text-mid hover:text-primary transition-colors">COPPA Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-light text-sm">
            © {new Date().getFullYear()} Tether App, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-light font-medium bg-surface px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            No ads. No data sold. Ever.
          </div>
        </div>
      </div>
    </footer>
  );
}
