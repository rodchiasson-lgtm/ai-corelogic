/*
 * AI-CoreLogic Category Grid
 * Theme: Deep Intelligence — category navigation with SEO links
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { categories, getArticlesByCategory } from "@/lib/blogData";
import { ArrowRight } from "lucide-react";

const categoryMetadata: Record<string, { description: string; icon: string; color: string }> = {
  "AI Strategy": {
    description: "Develop AI strategies and maturity frameworks aligned with business goals",
    icon: "🎯",
    color: "#2563EB",
  },
  "Process Mining": {
    description: "Uncover inefficiencies and optimize workflows with process mining",
    icon: "⚙️",
    color: "#00D4C8",
  },
  "AI Technology": {
    description: "Deploy LLMs and AI systems safely in enterprise environments",
    icon: "🚀",
    color: "#60A5FA",
  },
  "Change Management": {
    description: "Master organizational change and drive AI adoption",
    icon: "🔄",
    color: "#A78BFA",
  },
  "Business Value": {
    description: "Measure AI impact and build ROI business cases",
    icon: "💼",
    color: "#34D399",
  },
};

export default function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories" className="py-24 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10">
        {/* Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3 flex justify-center">Explore by Topic</div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Browse by{" "}
            <span className="gradient-text">Category</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Dive deep into specific topics with dedicated category pages featuring curated articles and expert insights.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories
            .filter((c) => c !== "All")
            .map((category, i) => {
              const meta = categoryMetadata[category];
              const articleCount = getArticlesByCategory(category).length;
              const slug = category.toLowerCase().replace(/\s+/g, "-");

              return (
                <Link key={category} href={`/category/${slug}`}>
                  <a
                    className={`group glow-card p-6 rounded-2xl flex flex-col h-full transition-all duration-700 hover:translate-y-[-4px] ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{
                      transitionDelay: `${i * 75}ms`,
                      textDecoration: "none",
                      background: "rgba(13,27,46,0.5)",
                      border: "1px solid rgba(0,212,200,0.15)",
                    }}
                  >
                    {/* Icon */}
                    <div className="text-4xl mb-4">{meta?.icon}</div>

                    {/* Title */}
                    <h3
                      className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {category}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1" style={{ fontFamily: "var(--font-body)" }}>
                      {meta?.description}
                    </p>

                    {/* Article count & CTA */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-xs text-slate-500 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                        {articleCount} {articleCount === 1 ? "article" : "articles"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </Link>
              );
            })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-12 p-8 rounded-2xl text-center transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
            border: "1px solid rgba(37,99,235,0.2)",
          }}
        >
          <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
            Can't find what you're looking for? Browse all articles or subscribe to our newsletter for weekly insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog">
              <a
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: "rgba(37,99,235,0.1)",
                  border: "1px solid rgba(37,99,235,0.3)",
                  color: "#60A5FA",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                View All Articles
              </a>
            </Link>
            <a
              href="#newsletter"
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: "#2563EB",
                color: "white",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#2563EB";
              }}
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
