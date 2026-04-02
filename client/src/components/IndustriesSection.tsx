/*
 * AI-CoreLogic Industries Section
 * Theme: Deep Intelligence — horizontal scrolling industry tags + brief descriptions
 */

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, HeartPulse, Truck, DollarSign, Building2, Factory, Utensils, GraduationCap, Beaker } from "lucide-react";

const industries = [
  {
    icon: DollarSign,
    name: "Financial Services",
    desc: "AI enables fraud detection, credit scoring, and automated reporting. Benefits: Reduced fraud losses by 40-60%, faster loan approvals, and improved risk management through real-time pattern analysis.",
    articleSlug: "ai-financial-services-differentiation",
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    desc: "AI powers patient analytics, clinical workflow automation, and diagnostics support. Benefits: Improved diagnostic accuracy, reduced patient wait times, and better treatment outcomes through predictive analytics.",
    articleSlug: "ai-healthcare-clinical-transformation",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    desc: "AI optimizes quality control, predictive maintenance, and process efficiency. Benefits: 20-30% reduction in downtime, improved product quality, and 15-25% increase in production efficiency.",
    articleSlug: "ai-manufacturing-quality-efficiency",
  },
  {
    icon: ShoppingBag,
    name: "Retail & E-Commerce",
    desc: "AI drives personalization, demand forecasting, and inventory optimization. Benefits: 10-15% increase in conversion rates, 25-35% reduction in excess inventory, and enhanced customer experience.",
    articleSlug: "ai-retail-personalization-conversion",
  },
  {
    icon: Truck,
    name: "Logistics & Supply Chain",
    desc: "AI optimizes routes, enables predictive maintenance, and improves demand planning. Benefits: 15-20% fuel cost savings, reduced delivery times, and 30% improvement in supply chain visibility.",
    articleSlug: "ai-logistics-optimization-efficiency",
  },
  {
    icon: Building2,
    name: "Real Estate",
    desc: "AI automates property valuation, market analysis, and lead qualification. Benefits: Faster property assessments, improved pricing accuracy, and 40% faster lead conversion.",
    articleSlug: "ai-real-estate-valuation-insights",
  },
  {
    icon: Beaker,
    name: "Life Sciences",
    desc: "AI accelerates drug discovery, clinical trial optimization, and research data analysis. Benefits: 30-50% reduction in R&D time, improved trial recruitment, and faster time-to-market for new therapies.",
    articleSlug: "ai-life-sciences-drug-discovery",
  },
  {
    icon: Factory,
    name: "Food & Hospitality",
    desc: "AI optimizes demand forecasting, menu engineering, and customer insights. Benefits: 20% reduction in food waste, improved customer satisfaction, and 10-15% revenue increase through personalization.",
    articleSlug: "ai-food-hospitality-optimization",
  },
];

export default function IndustriesSection() {
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
    <section className="py-20 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={ref} className="container relative z-10">
        <div
          className={`mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">Industries We Serve</div>
          <h2
            className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            AI Solutions Across{" "}
            <span className="gradient-text">Every Sector</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.name}
                className={`group p-4 rounded-xl cursor-default transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  background: "rgba(13,27,46,0.5)",
                  border: "1px solid rgba(0,212,200,0.08)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,200,0.3)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(13,27,46,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,200,0.08)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(13,27,46,0.5)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "rgba(0,212,200,0.08)", border: "1px solid rgba(0,212,200,0.15)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                </div>
                <h4
                  className="text-white font-semibold text-sm mb-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {industry.name}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  {industry.desc}
                </p>
                <a
                  href={`/blog/${industry.articleSlug}`}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                  style={{ textDecoration: "none", fontFamily: "var(--font-body)" }}
                >
                  Read Article →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
