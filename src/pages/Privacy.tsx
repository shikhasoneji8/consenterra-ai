import { Link } from "react-router-dom";
import { Shield, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy & Terms of Use
            </h1>
            <p className="text-muted-foreground mb-6">
              Last updated: January 3, 2026
            </p>
            <Button asChild variant="outline">
              <Link to="/solutions/prixplainer">
                <Shield className="mr-2 h-4 w-4" />
                Analyze with PriXplainer
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto prose prose-slate">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At ConsenTerra, Inc., we believe in transparency and trust. This Privacy Policy 
                explains how we collect, use, and protect your information when you use our website 
                and services. We've written this in plain language—no legal jargon, no hidden agendas.
              </p>
            </div>

            {/* Data Collection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">What We Collect</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Contact Information:</strong> Name and email when you reach out to us.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Usage Data:</strong> Anonymous analytics to improve our services.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Cookie Preferences:</strong> Your consent choices stored locally.</span>
                </li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use essential cookies to make our site work and analytics cookies to understand 
                how you use our services. You control these choices:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Essential:</strong> Required for basic functionality. Always on.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Analytics:</strong> Help us improve. You can opt out anytime.</span>
                </li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Opt out of marketing communications</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Update your cookie preferences</span>
                </li>
              </ul>
            </div>

            {/* No Dark Patterns */}
            <div className="mb-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold text-foreground mb-3">Our Promise</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>No dark patterns or manipulative design</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>We never sell your personal data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>AI transparency in all our products</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Your consent is always respected</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any concerns about your privacy or want to exercise your rights, 
                please reach out to us through our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact page
                </Link>
                . We're here to help and will respond promptly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="section-container text-center">
          <p className="text-muted-foreground mb-4">
            Have questions about our privacy practices?
          </p>
          <Button asChild>
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
