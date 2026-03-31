/*
 * AI-CoreLogic Navbar
 * Theme: Deep Intelligence — dark aerospace, cyan accents
 * Behavior: Transparent on top, blurred on scroll
 */

import { useState, useEffect } from "react";
import { Menu, X, Cpu } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 rounded-lg border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors" />
              <Cpu className="w-5 h-5 text-cyan-400 relative z-10" strokeWidth={1.5} />
            </div>
            <div>
              <span
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.01em" }}
                className="text-white"
              >
                AI-<span className="gradient-text">CoreLogic</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="mailto:rodchiasson@ai-corelogic.com"
              className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Contact
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden nav-blur border-t border-cyan-400/10">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-cyan-400/10">
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-primary w-full px-5 py-3 rounded-lg text-sm font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
