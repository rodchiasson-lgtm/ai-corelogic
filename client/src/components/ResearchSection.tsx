/*
 * AI-CoreLogic Research Section
 * Theme: Deep Intelligence — research insights with dark cards
 * Features: Research focus areas, latest insights preview
 */

import { useEffect, useRef, useState } from "react";
import { BookOpen, TrendingUp, Brain, Database, ArrowUpRight } from "lucide-react";

const researchAreas = [
  {
    icon: Brain,
    title: "Large Language Models for Business",
    category: "Applied Research",
    description: "Evaluating and adapting state-of-the-art LLMs for enterprise workflows, customer service automation, and knowledge management.",
    tag: "LLM / NLP",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics in SMB Operations",
    category: "Applied Research",
    description: "Developing lightweight forecasting models that deliver enterprise-grade predictions without enterprise-scale infrastructure.",
    tag: "Forecasting",
  },
  {
    icon: Database,
    title: "Data Readiness Frameworks",
    category: "Methodology",
    description: "Standardized assessment tools for evaluating organizational data quality, governance, and AI-readiness across five dimensions.",
    tag: "Data Strategy",
  },
  {
    icon: BookOpen,
    title: "AI Ethics & Governance for SMBs",
    category: "Policy Research",
    description: "Practical governance frameworks that help smaller organizations implement responsible AI practices without bureaucratic overhead.",
    tag: "Governance",
  },
];

export default function ResearchSection() {
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
    <section id="research" className="py-24 relative" style={{ background: "#0D1B2E" }}>
      {/* Diagonal top */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: "#050B18",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)",
        }}
      />

      <div ref={ref} className="container relative z-10 pt-8">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">Knowledge & Insights</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              AI Research &{" "}
              <span className="gradient-text">Thought Leadership</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md lg:text-right" style={{ fontFamily: "var(--font-body)" }}>
              Our research practice continuously evaluates emerging AI technologies and translates findings into actionable business intelligence.
            </p>
          </div>
        </div>

        {/* Research cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchAreas.map((area, i) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className={`glow-card p-6 rounded-2xl group transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,212,200,0.1)", border: "1px solid rgba(0,212,200,0.2)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="mono-label text-xs">{area.category}</div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(37,99,235,0.15)",
                          border: "1px solid rgba(37,99,235,0.3)",
                          color: "#60A5FA",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {area.tag}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0"
                  />
                </div>

                <h3
                  className="text-white font-bold text-lg mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {area.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Research CTA */}
        <div
          className={`mt-12 p-8 rounded-2xl transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
            border: "1px solid rgba(0,212,200,0.15)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-white font-bold text-xl mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stay Ahead with Our AI Insights
              </h3>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Receive curated research summaries, case studies, and AI trend reports directly to your inbox.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <input
                type="email"
                placeholder="your@company.com"
                className="px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 w-56"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,212,200,0.2)",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              />
              <button className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
