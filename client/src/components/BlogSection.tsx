/*
 * AI-CoreLogic Featured Blog Section
 * Theme: Deep Intelligence — featured articles showcase
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { getFeaturedArticles } from "@/lib/blogData";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const articles = getFeaturedArticles();

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
    <section id="blog" className="py-24 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">Latest Insights</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              AI Consulting{" "}
              <span className="gradient-text">Blog</span>
            </h2>
            <Link href="/blog">
              <a
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-fit"
                style={{
                  background: "rgba(37,99,235,0.1)",
                  border: "1px solid rgba(37,99,235,0.3)",
                  color: "#60A5FA",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                View All Articles
                <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <a
                className={`group glow-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-700 hover:translate-y-[-4px] ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms`, textDecoration: "none" }}
              >
                {/* Category badge */}
                <div className="p-6 pb-0">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold inline-block"
                    style={{
                      background: "rgba(37,99,235,0.15)",
                      border: "1px solid rgba(37,99,235,0.3)",
                      color: "#60A5FA",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3
                    className="text-white font-bold text-lg mb-3 group-hover:text-cyan-400 transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1" style={{ fontFamily: "var(--font-body)" }}>
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime} min
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 p-8 rounded-2xl text-center transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
            border: "1px solid rgba(0,212,200,0.15)",
          }}
        >
          <h4
            className="text-white font-bold text-lg mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            More Articles Coming Soon
          </h4>
          <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
            We publish new insights on AI strategy, process mining, and digital transformation weekly. Subscribe to stay updated.
          </p>
          <a
            href="#newsletter"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
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
            Subscribe to Newsletter
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
