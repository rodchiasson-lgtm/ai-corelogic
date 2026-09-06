/*
 * AI-CoreLogic Research Section
 * Theme: Deep Intelligence — research insights with dark cards
 * Features: Research focus areas, latest insights preview
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { BookOpen, TrendingUp, Brain, Database, ArrowUpRight, Activity, ShieldCheck } from "lucide-react";

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

        {/* Integrated Intelligence Desk feature */}
        <div
          className={`mt-12 overflow-hidden rounded-2xl transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "linear-gradient(135deg, rgba(3,8,16,0.96) 0%, rgba(8,28,45,0.95) 58%, rgba(15,32,53,0.96) 100%)",
            border: "1px solid rgba(0,212,200,0.22)",
            boxShadow: "0 28px 80px rgba(0,0,0,0.24)",
          }}
        >
          <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
            <div className="p-7 sm:p-9 lg:p-10">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-400">
                <Activity className="h-4 w-4" /> Intelligence Desk / Signal Ledger
              </div>
              <h3 className="mt-5 max-w-2xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Four earnings stories. <span className="gradient-text">One infrastructure cycle.</span>
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                Enter our source-forward comparative research desk for memory pricing, cloud monetization, and accelerated-compute demand — with dated market context and traceable evidence.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/intelligence" className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">
                  Open Intelligence Desk <ArrowUpRight className="h-4 w-4" />
                </Link>
                <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" /> Research only · no price targets
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-cyan-400/10 bg-cyan-400/[0.025] lg:border-l lg:border-t-0">
              {[
                ["SNDK", "+437%", "Datacenter FY"],
                ["AMZN", "+37%", "AWS YoY"],
                ["NVDA", "+117%", "Data Center YoY"],
                ["MU", "+346%", "Revenue YoY"],
              ].map(([ticker, value, label], index) => (
                <div key={ticker} className={`p-6 ${index % 2 === 0 ? "border-r border-cyan-400/10" : ""} ${index < 2 ? "border-b border-cyan-400/10" : ""}`}>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-cyan-400">{ticker}</span>
                  <strong className="mt-3 block text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{value}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
