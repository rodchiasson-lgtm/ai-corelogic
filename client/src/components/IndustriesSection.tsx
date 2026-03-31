/*
 * AI-CoreLogic Industries Section
 * Theme: Deep Intelligence — horizontal scrolling industry tags + brief descriptions
 */

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, HeartPulse, Truck, DollarSign, Building2, Factory, Utensils, GraduationCap } from "lucide-react";

const industries = [
  { icon: ShoppingBag, name: "Retail & E-Commerce", desc: "Personalization, demand forecasting, inventory optimization" },
  { icon: HeartPulse, name: "Healthcare", desc: "Patient analytics, clinical workflow automation, diagnostics support" },
  { icon: Truck, name: "Logistics & Supply Chain", desc: "Route optimization, predictive maintenance, demand planning" },
  { icon: DollarSign, name: "Financial Services", desc: "Fraud detection, credit scoring, automated reporting" },
  { icon: Building2, name: "Real Estate", desc: "Property valuation, market analysis, lead qualification" },
  { icon: Factory, name: "Manufacturing", desc: "Quality control, predictive maintenance, process optimization" },
  { icon: Utensils, name: "Food & Hospitality", desc: "Demand forecasting, menu optimization, customer insights" },
  { icon: GraduationCap, name: "Education & Training", desc: "Personalized learning, content generation, student analytics" },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <p className="text-slate-500 text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {industry.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
