/*
 * AI-CoreLogic CTA Banner
 * Theme: Deep Intelligence — full-width gradient CTA before footer
 */

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "#050B18" }}>
      <div ref={ref} className="container relative z-10">
        <div
          className={`relative rounded-3xl overflow-hidden p-10 lg:p-16 transition-all duration-700 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{
            background: "linear-gradient(135deg, #0D1B2E 0%, #0F2035 50%, #0D1B2E 100%)",
            border: "1px solid rgba(0,212,200,0.2)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-64 h-64 opacity-8 pointer-events-none"
            style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
          />

          {/* Circuit decoration */}
          <svg className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block" width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#00D4C8" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="50" stroke="#00D4C8" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" stroke="#00D4C8" strokeWidth="1" />
            <circle cx="100" cy="100" r="4" fill="#00D4C8" />
            <line x1="100" y1="20" x2="100" y2="80" stroke="#00D4C8" strokeWidth="0.5" />
            <line x1="100" y1="120" x2="100" y2="180" stroke="#00D4C8" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="80" y2="100" stroke="#00D4C8" strokeWidth="0.5" />
            <line x1="120" y1="100" x2="180" y2="100" stroke="#00D4C8" strokeWidth="0.5" />
          </svg>

          <div className="relative z-10 max-w-2xl">
            <div className="mono-label mb-4">Ready to Get Started?</div>
            <h2
              className="text-3xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Transform Your Business with{" "}
              <span className="gradient-text">AI Intelligence</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg" style={{ fontFamily: "var(--font-body)" }}>
              Book a free 30-minute discovery call. No commitment, no sales pressure — just a focused conversation about your AI potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-primary flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold"
              >
                <Calendar className="w-4 h-4" />
                Book Free Discovery Call
              </button>
              <button
                onClick={() => { const el = document.querySelector("#services"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-outline-glow flex items-center gap-2 px-7 py-4 rounded-xl text-base"
              >
                View Services <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
