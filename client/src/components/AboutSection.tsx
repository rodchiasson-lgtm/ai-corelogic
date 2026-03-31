/*
 * AI-CoreLogic About Section
 * Theme: Deep Intelligence — asymmetric layout, left text / right visual
 * Features: Value propositions, team expertise highlights
 */

import { useEffect, useRef, useState } from "react";
import { Shield, Users, Zap, Globe } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trusted Expertise",
    description: "Over a decade of hands-on AI consulting experience across industries — from retail and healthcare to logistics and finance.",
  },
  {
    icon: Users,
    title: "SMB-First Approach",
    description: "We specialize in right-sizing AI solutions for small to mid-sized companies — practical, affordable, and scalable.",
  },
  {
    icon: Zap,
    title: "Rapid Time-to-Value",
    description: "Our structured methodology delivers measurable results within weeks, not years. We focus on quick wins that build momentum.",
  },
  {
    icon: Globe,
    title: "Full-Spectrum Coverage",
    description: "From strategy and research to engineering and change management — we cover every dimension of AI transformation.",
  },
];

export default function AboutSection() {
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
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-32 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }}
        />
        <svg className="absolute right-0 top-0 h-full opacity-5 w-64" viewBox="0 0 200 800" fill="none">
          <path d="M200,0 L100,100 L150,200 L50,300 L150,400 L50,500 L150,600 L50,700 L200,800" stroke="#00D4C8" strokeWidth="1" />
          <circle cx="100" cy="100" r="4" fill="#00D4C8" />
          <circle cx="150" cy="200" r="4" fill="#00D4C8" />
          <circle cx="50" cy="300" r="4" fill="#00D4C8" />
          <circle cx="150" cy="400" r="4" fill="#00D4C8" />
          <circle cx="50" cy="500" r="4" fill="#00D4C8" />
          <circle cx="150" cy="600" r="4" fill="#00D4C8" />
          <circle cx="50" cy="700" r="4" fill="#00D4C8" />
        </svg>
      </div>

      <div ref={ref} className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="mono-label mb-3">Who We Are</div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              AI Consulting Built for{" "}
              <span className="gradient-text">Real Business</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
              AI-CoreLogic was founded on a simple premise: AI should be accessible, practical, and transformative for every business — not just the Fortune 500. We bridge the gap between cutting-edge AI research and real-world business outcomes.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Our multidisciplinary team of AI engineers, data scientists, and business strategists work as an extension of your organization — understanding your unique challenges and delivering solutions that create lasting competitive advantage.
            </p>

            <button
              onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-outline-glow px-6 py-3 rounded-lg font-semibold"
            >
              Meet Our Team
            </button>
          </div>

          {/* Right: Values grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="glow-card p-5 rounded-xl"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "rgba(0,212,200,0.1)", border: "1px solid rgba(0,212,200,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                  </div>
                  <h4
                    className="text-white font-bold text-sm mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {v.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
