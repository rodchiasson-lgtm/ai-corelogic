/*
 * AI-CoreLogic Footer
 * Theme: Deep Intelligence — dark footer with brand links and legal
 */

import { Cpu, Linkedin, Twitter, Github } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "AI Discovery", href: "#services" },
    { label: "AI Implementation", href: "#services" },
    { label: "AI Research", href: "#research" },
    { label: "AI Maturity", href: "#services" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Our Process", href: "#process" },
    { label: "Case Studies", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Resources: [
    { label: "AI Insights Blog", href: "#research" },
    { label: "Maturity Assessment", href: "#contact" },
    { label: "AI Readiness Quiz", href: "#contact" },
    { label: "Documentation", href: "#" },
  ],
};

export default function Footer() {
  const handleNav = (href: string) => {
    if (href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#030810", borderTop: "1px solid rgba(0,212,200,0.08)" }}>
      <div className="container py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20" />
                <div className="absolute inset-0 rounded-lg border border-cyan-400/30" />
                <Cpu className="w-5 h-5 text-cyan-400 relative z-10" strokeWidth={1.5} />
              </div>
              <span
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}
                className="text-white"
              >
                AI-<span className="gradient-text">CoreLogic</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
              Precision-driven AI consulting for small to mid-sized businesses. From discovery to deployment — we make AI work for you.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all duration-200 hover:border-cyan-400/40"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white font-semibold text-sm mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="text-slate-500 hover:text-cyan-400 text-sm transition-colors duration-200 text-left"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-slate-600 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} AI-CoreLogic. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <button
                key={item}
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
