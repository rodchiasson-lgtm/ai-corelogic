/*
 * AI-CoreLogic Stats Band
 * Theme: Deep Intelligence — horizontal stats band with animated counters
 */

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50, suffix: "+", label: "SMBs Transformed", description: "Businesses successfully guided through AI adoption" },
  { value: 98, suffix: "%", label: "Client Satisfaction", description: "Measured across all project engagements" },
  { value: 12, suffix: "+", label: "Years of Expertise", description: "Deep AI consulting and implementation experience" },
  { value: 40, suffix: "%", label: "Avg. Efficiency Gain", description: "Operational improvement post-implementation" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
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
    <section className="stats-band py-16 relative overflow-hidden">
      {/* Decorative circuit lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1280 120" preserveAspectRatio="none">
          <path d="M0,60 L200,60 L220,40 L400,40 L420,60 L600,60 L620,80 L800,80 L820,60 L1280,60" stroke="#00D4C8" strokeWidth="1" fill="none" />
          <path d="M0,80 L100,80 L120,60 L300,60 L320,80 L500,80 L520,40 L700,40 L720,80 L1280,80" stroke="#2563EB" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div ref={ref} className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center lg:text-left transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="gradient-text font-bold leading-none mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {stat.label}
              </div>
              <div className="text-slate-500 text-xs leading-relaxed hidden lg:block" style={{ fontFamily: "var(--font-body)" }}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
