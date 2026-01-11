import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Roadmap', href: '#' },
  ],
  resources: [
    { label: 'FAQs', href: '#faq' },
    { label: 'Case Studies', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Compliance', href: '#' },
  ],
};

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
  { icon: <Github className="h-5 w-5" />, href: '#', label: 'GitHub' },
];

export function Footer() {
  const handleLinkClick = (href: string) => {
    if (href.startsWith('#') && href !== '#') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <a
              href="#"
              className="flex items-center gap-2 mb-4"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Anomaly<span className="text-primary">Guard</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              AI-powered policy anomaly detection for transparent, 
              accountable governance at any scale.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 ChitraGuptAI – AI for Transparent Governance
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
