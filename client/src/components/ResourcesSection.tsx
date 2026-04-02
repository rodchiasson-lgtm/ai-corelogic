/*
 * AI-CoreLogic Resources Section
 * Theme: Deep Intelligence — showcase Celonis preparation guides and architecture docs
 * Features: Resource cards with preview and download/view options
 */

import { useEffect, useRef, useState } from "react";
import { BookOpen, ExternalLink, Download, FileText, Zap, Users, Building2 } from "lucide-react";

const resources = [
  {
    icon: Building2,
    title: "Celonis Platform Architecture",
    description: "Deep dive into the five-layer Celonis stack — from data sources to consumer applications. Understand the data flow, integration patterns, and core components.",
    category: "Technical Reference",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/celonis_architecture_2162f4ec.html",
    color: "#00D4C8",
    badge: "Architecture",
  },
  {
    icon: Users,
    title: "C-Suite Preparation Guide",
    description: "Executive-level overview for decision makers. Learn how to position Celonis for board-level discussions and secure stakeholder buy-in.",
    category: "Executive Readiness",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/celonis_csuite_prep_ee2172c9.html",
    color: "#2563EB",
    badge: "Executive",
  },
  {
    icon: FileText,
    title: "Enterprise Architect Interview",
    description: "Comprehensive guide for architects evaluating Celonis. Covers system integration, scalability, security, and enterprise deployment considerations.",
    category: "Technical Deep Dive",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/celonis_enterprise_architect_interview_7eb7859d.html",
    color: "#00D4C8",
    badge: "Architecture",
  },
  {
    icon: Zap,
    title: "Technical Preparation Guide",
    description: "Hands-on technical reference for implementation teams. Includes setup procedures, configuration best practices, and troubleshooting strategies.",
    category: "Implementation Guide",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/celonis_technical_prep_912f0382.html",
    color: "#2563EB",
    badge: "Technical",
  },
];

export default function ResourcesSection() {
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
    <section id="resources" className="py-24 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
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
          <div className="mono-label mb-3">Learning Hub</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Celonis{" "}
              <span className="gradient-text">Resources</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md lg:text-right" style={{ fontFamily: "var(--font-body)" }}>
              Comprehensive guides covering architecture, executive strategy, technical implementation, and enterprise integration patterns.
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {resources.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
                className={`glow-card p-6 rounded-2xl group transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,200,0.1)", border: "1px solid rgba(0,212,200,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: resource.color }} strokeWidth={1.5} />
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: `${resource.color}20`,
                      border: `1px solid ${resource.color}40`,
                      color: resource.color,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {resource.badge}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {resource.title}
                </h3>

                {/* Category */}
                <div className="mono-label text-xs mb-3 opacity-60">{resource.category}</div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  {resource.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      background: `${resource.color}20`,
                      border: `1px solid ${resource.color}40`,
                      color: resource.color,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `${resource.color}30`;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${resource.color}60`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `${resource.color}20`;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${resource.color}40`;
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Guide
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info banner */}
        <div
          className={`p-6 rounded-2xl transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
            border: "1px solid rgba(0,212,200,0.15)",
          }}
        >
          <div className="flex items-start gap-4">
            <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#00D4C8" }} />
            <div>
              <h4
                className="text-white font-bold text-sm mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Need Custom Training?
              </h4>
              <p className="text-slate-400 text-sm mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Our team offers tailored Celonis workshops and implementation support. These guides are starting points — we customize training based on your specific use cases and team composition.
              </p>
              <a
                href="mailto:admin@core-logic.com"
                className="text-sm font-semibold"
                style={{ color: "#00D4C8", textDecoration: "none" }}
              >
                Schedule a consultation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
