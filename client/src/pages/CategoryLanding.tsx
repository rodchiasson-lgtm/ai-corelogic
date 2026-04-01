/*
 * AI-CoreLogic Category Landing Page
 * Theme: Deep Intelligence — SEO-optimized category pages
 */

import { useRoute, Link } from "wouter";
import { getArticlesByCategory, categories, blogArticles } from "@/lib/blogData";
import { Calendar, Clock, ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const categoryMetadata: Record<string, { title: string; description: string; icon: string; color: string }> = {
  "AI Strategy": {
    title: "AI Strategy & Planning",
    description: "Comprehensive guides on developing AI strategies, building maturity frameworks, and aligning AI initiatives with business objectives for sustainable growth.",
    icon: "🎯",
    color: "#2563EB",
  },
  "Process Mining": {
    title: "Process Mining & Optimization",
    description: "Discover how process mining uncovers hidden inefficiencies, automates workflows, and drives operational transformation for mid-sized organizations.",
    icon: "⚙️",
    color: "#00D4C8",
  },
  "AI Technology": {
    title: "AI Technology & Implementation",
    description: "Technical deep-dives on deploying LLMs, machine learning models, and AI systems safely and effectively in enterprise environments.",
    icon: "🚀",
    color: "#60A5FA",
  },
  "Change Management": {
    title: "Change Management & Adoption",
    description: "Master the human side of AI transformation with proven strategies for organizational change, stakeholder engagement, and sustainable adoption.",
    icon: "🔄",
    color: "#A78BFA",
  },
  "Business Value": {
    title: "Business Value & ROI",
    description: "Learn how to measure AI impact, quantify ROI, and build compelling business cases for continued AI investment and scaling.",
    icon: "💼",
    color: "#34D399",
  },
};

export default function CategoryLanding() {
  const [route, params] = useRoute("/category/:slug");
  const [category, setCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<typeof blogArticles>([]);
  const [metadata, setMetadata] = useState<(typeof categoryMetadata)["AI Strategy"] | null>(null);

  useEffect(() => {
    const slug = params?.slug;
    if (slug) {
      // Convert slug to category name (e.g., "ai-strategy" -> "AI Strategy")
      const categoryName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const validCategory = categories.find((c) => c === categoryName);
      if (validCategory) {
        setCategory(validCategory);
        setArticles(getArticlesByCategory(validCategory));
        setMetadata(categoryMetadata[validCategory] || null);
      }
    }
  }, [params?.slug]);

  if (!category || !metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Category Not Found
          </h1>
          <p className="text-slate-400 mb-8" style={{ fontFamily: "var(--font-body)" }}>
            The category you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold" style={{ background: "#2563EB", color: "white", textDecoration: "none" }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="py-16 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
            style={{ background: `radial-gradient(circle, ${metadata.color} 0%, transparent 70%)` }}
          />
        </div>

        <div className="container relative z-10">
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6" style={{ textDecoration: "none", fontFamily: "var(--font-body)" }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </a>
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{metadata.icon}</span>
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold inline-block"
                style={{
                  background: `rgba(37,99,235,0.15)`,
                  border: `1px solid rgba(37,99,235,0.3)`,
                  color: "#60A5FA",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {category}
              </span>
            </div>

            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              {metadata.title}
            </h1>

            <p className="text-slate-400 text-lg" style={{ fontFamily: "var(--font-body)" }}>
              {metadata.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-8 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {articles.length}
              </div>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Articles in this category
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {Math.round(articles.reduce((sum, a) => sum + a.readTime, 0) / articles.length)}
              </div>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Average read time (minutes)
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {articles.filter((a) => a.featured).length}
              </div>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Featured articles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-16 relative">
        <div className="container">
          {articles.length > 0 ? (
            <div>
              <h2
                className="text-3xl font-bold text-white mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All {category} Articles
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <a
                      className="group glow-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px]"
                      style={{ textDecoration: "none" }}
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
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                No articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Categories */}
      <div className="py-16 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container">
          <h3
            className="text-2xl font-bold text-white mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore Other Topics
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories
              .filter((c) => c !== "All" && c !== category)
              .map((cat) => {
                const catMeta = categoryMetadata[cat];
                const catSlug = cat.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link key={cat} href={`/category/${catSlug}`}>
                    <a
                      className="p-6 rounded-xl hover:translate-y-[-2px] transition-all duration-300"
                      style={{
                        background: "rgba(13,27,46,0.5)",
                        border: "1px solid rgba(0,212,200,0.15)",
                        textDecoration: "none",
                      }}
                    >
                      <div className="text-3xl mb-2">{catMeta?.icon}</div>
                      <h4
                        className="text-white font-bold text-sm mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {cat}
                      </h4>
                      <p className="text-slate-500 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                        {getArticlesByCategory(cat).length} articles
                      </p>
                    </a>
                  </Link>
                );
              })}
          </div>
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
              Get {category} Insights Weekly
            </h3>
            <p className="text-slate-400 text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Subscribe to our newsletter for the latest articles, case studies, and expert insights on {category.toLowerCase()}.
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
              Subscribe Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
