import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/ConsenTerra_Logo.png";
import AuroraBackground from "@/components/AuroraBackground";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Career", href: "/career" },
    { name: "Contact Us", href: "/contact" },
  ],
  product: [
    { name: "Roadmap", href: "/roadmap" },
    { name: "Changelog", href: "/changelog" },
    { name: "Research", href: "/research" },
    { name: "Responsible AI", href: "/about#responsible-ai" },
  ],
  solutions: [
    { name: "PriXplainer", href: "/solutions/prixplainer" },
    { name: "FoundrFATE", href: "/solutions/foundrfate" },
    { name: "TrustEarthy", href: "/solutions/trusteartthy" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/privacy" },
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (href: string) => {
    navigate(href);
    scrollToTop();
  };

  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="section-container py-12 lg:py-16">
      <div className="absolute inset-0 opacity-30">
        <AuroraBackground showParticles={false} />
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button 
              onClick={() => handleLinkClick("/")} 
              className="flex items-center gap-2 mb-4"
            >
              <img src={logo} alt="ConsenTerra" className="h-10 w-10" />
              <span className="text-lg font-semibold text-foreground">ConsenTerra</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clarity for Everyday Decisions. Empowering individuals and organizations with AI-driven insights.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ConsenTerra, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with trust, transparency, and care.
          </p>
        </div>
      </div>
    </footer>
  );
}
