/*
 * AI-CoreLogic Testimonials Section
 * Theme: Deep Intelligence — testimonial cards with quote styling
 */

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AI-CoreLogic transformed how we handle customer inquiries. Their implementation of an AI-powered support system reduced our response time by 60% and freed our team to focus on high-value work.",
    name: "Sarah Chen",
    title: "COO, Meridian Logistics",
    industry: "Logistics & Supply Chain",
    initials: "SC",
    color: "#00D4C8",
  },
  {
    quote: "The AI maturity assessment was eye-opening. We thought we were further along than we were. Their roadmap gave us a clear, realistic path to becoming a truly data-driven organization.",
    name: "Marcus Williams",
    title: "CEO, Vertex Healthcare Solutions",
    industry: "Healthcare Technology",
    initials: "MW",
    color: "#2563EB",
  },
  {
    quote: "What sets AI-CoreLogic apart is their ability to speak both the language of business and technology. They didn't just build us a model — they helped us build an AI culture.",
    name: "Priya Nair",
    title: "VP of Operations, Bloom Retail Group",
    industry: "Retail & E-Commerce",
    initials: "PN",
    color: "#00D4C8",
  },
  {
    quote: "As a 50-person company, we were skeptical that enterprise-grade AI was within reach. AI-CoreLogic proved us wrong. Their discovery phase alone uncovered $400K in annual efficiency opportunities.",
    name: "James Okafor",
    title: "Founder, Pinnacle Financial Services",
    industry: "Financial Services",
    initials: "JO",
    color: "#2563EB",
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-3"
          style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10">
        {/* Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3 flex justify-center">Client Outcomes</div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            What Our Clients{" "}
            <span className="gradient-text">Say</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Real results from real businesses that partnered with AI-CoreLogic to transform their operations.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card p-7 rounded-2xl transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-6 h-6 opacity-40" style={{ color: t.color }} />
              </div>

              {/* Quote text */}
              <p
                className="text-slate-200 text-base leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4"
                style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: `${t.color}20`,
                    border: `1px solid ${t.color}40`,
                    color: t.color,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                    {t.name}
                  </div>
                  <div className="text-slate-500 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    {t.title}
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#64748B",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t.industry}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
