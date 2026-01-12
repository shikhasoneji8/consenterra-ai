import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import ScrollToTop from "./ScrollToTop";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(270 70% 70%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(270 70% 70%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </div>
  );
}