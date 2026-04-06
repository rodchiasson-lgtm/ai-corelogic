/*
 * AI-CoreLogic Footer
 * Theme: Deep Intelligence — dark footer with brand links and legal
 */

import { Cpu, Linkedin, Twitter, Github, MessageCircle } from "lucide-react";

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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L.929 23.589l8.257-2.414a9.9 9.9 0 004.736 1.204h.004c5.44 0 9.902-4.413 9.914-9.85.002-2.631-.674-5.159-1.95-7.39-1.277-2.23-3.055-4.113-5.282-5.39-2.226-1.277-4.755-1.968-7.358-1.968z" />
  </svg>
);

const WHATSAPP_NUMBER = "17273189265";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'm interested in learning more about AI-CoreLogic's consulting services.");

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
            <div className="text-slate-600 text-xs space-y-1 mb-6">
              <p><strong>Contact:</strong> admin@ai-corelogic.com</p>
              <p><strong>Phone:</strong> +1 (727) 318-9265</p>
              <p><strong>Offices:</strong> London, UK & New York, USA</p>
            </div>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/rodneychiasson", label: "LinkedIn", color: "#0A66C2" },
                { icon: MessageCircle, href: "https://t.me/Aicorelogic_bot", label: "Telegram", color: "#0088CC" },
                { icon: null, href: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, label: "WhatsApp", color: "#25D366" },
                { icon: Twitter, href: "#", label: "Twitter", color: undefined },
                { icon: Github, href: "#", label: "GitHub", color: undefined },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-cyan-400/40"
                  style={{
                    background: label === "Telegram" ? "rgba(0,136,204,0.12)" : label === "WhatsApp" ? "rgba(37,211,102,0.12)" : "rgba(255,255,255,0.04)",
                    border: label === "Telegram" ? "1px solid rgba(0,136,204,0.3)" : label === "WhatsApp" ? "1px solid rgba(37,211,102,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    color: color || undefined,
                  }}
                >
                  {label === "WhatsApp" ? (
                    <WhatsAppIcon className="w-4 h-4" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                  ) : null}
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
