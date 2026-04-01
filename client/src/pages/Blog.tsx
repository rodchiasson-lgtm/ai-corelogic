/*
 * AI-CoreLogic Blog Listing Page
 * Theme: Deep Intelligence — blog article grid with filtering
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { blogArticles, categories } from "@/lib/blogData";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(blogArticles);
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

  useEffect(() => {
    let filtered = blogArticles;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.excerpt.toLowerCase().includes(term) ||
          article.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="py-20 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="mono-label mb-3">AI Consulting Insights</div>
            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              AI & Process Mining{" "}
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
              Expert insights on AI implementation, process mining, change management, and digital transformation for mid-sized businesses.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="py-12 sticky top-16 z-40" style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,212,200,0.1)" }}>
        <div className="container">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-white text-sm placeholder-slate-500 transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,212,200,0.15)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: selectedCategory === cat ? "#2563EB" : "rgba(255,255,255,0.05)",
                    border: selectedCategory === cat ? "1px solid #2563EB" : "1px solid rgba(0,212,200,0.15)",
                    color: selectedCategory === cat ? "white" : "#94A3B8",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div ref={ref} className="py-16 relative">
        <div className="container">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, i) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <a
                    className={`group glow-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-700 hover:translate-y-[-4px] ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
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
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                No articles found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="py-16 relative">
        <div className="container">
          <div
            className="p-8 rounded-2xl text-center"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
              border: "1px solid rgba(37,99,235,0.2)",
            }}
          >
            <h3
              className="text-white font-bold text-2xl mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get New Articles in Your Inbox
            </h3>
            <p className="text-slate-400 text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Subscribe to our newsletter for weekly AI insights and implementation strategies.
            </p>
            <a
              href="#newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: "#2563EB",
                color: "white",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#2563EB";
              }}
            >
              Subscribe Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
