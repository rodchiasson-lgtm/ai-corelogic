/*
 * AI-CoreLogic Process Section
 * Theme: Deep Intelligence — step-by-step engagement process
 * Layout: Horizontal steps on desktop, vertical on mobile
 */

import { useEffect, useRef, useState } from "react";
import { ClipboardList, Lightbulb, Code2, Rocket, LineChart } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Discovery Call",
    description: "We start with a no-obligation consultation to understand your business, goals, and current AI maturity level.",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Strategy Design",
    description: "Our team crafts a tailored AI strategy and roadmap aligned with your specific business objectives and constraints.",
  },
  {
    num: "03",
    icon: Code2,
    title: "Build & Integrate",
    description: "We develop, test, and deploy AI solutions — integrating seamlessly with your existing tools and workflows.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Launch & Train",
    description: "Solutions go live with comprehensive training for your team, ensuring smooth adoption and maximum impact.",
  },
  {
    num: "05",
    icon: LineChart,
    title: "Optimize & Scale",
    description: "Ongoing monitoring, performance optimization, and scaling support to grow your AI capabilities over time.",
  },
];

export default function ProcessSection() {
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
    <section id="process" className="py-24 relative" style={{ background: "#0D1B2E" }}>
      {/* Diagonal top */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: "#050B18",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 opacity-5"
          style={{ background: "radial-gradient(ellipse, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10 pt-8">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">How We Work</div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Our Engagement{" "}
            <span className="gradient-text">Process</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            A structured, transparent approach that delivers results at every stage — from first conversation to long-term AI operations.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,200,0.3) 10%, rgba(0,212,200,0.3) 90%, transparent)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`relative transition-all duration-700 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden absolute left-5 top-16 bottom-0 w-px"
                      style={{ background: "linear-gradient(180deg, rgba(0,212,200,0.3), transparent)" }} />
                  )}

                  <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                    {/* Step circle */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                        style={{
                          background: "linear-gradient(135deg, rgba(0,212,200,0.15) 0%, rgba(37,99,235,0.15) 100%)",
                          border: "1px solid rgba(0,212,200,0.3)",
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                      </div>
                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-full opacity-30 animate-glow"
                        style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }}
                      />
                    </div>

                    <div className="lg:mt-6">
                      <div className="mono-label mb-1">{step.num}</div>
                      <h3
                        className="text-white font-bold text-base mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <button
            onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
          >
            Book a Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}
