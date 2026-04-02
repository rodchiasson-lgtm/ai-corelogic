/*
 * AI-CoreLogic Blog Article Page
 * Theme: Deep Intelligence — individual article display with related articles
 */

import { useRoute, Link } from "wouter";
import { getArticleBySlug, blogArticles } from "@/lib/blogData";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogArticle() {
  const [route, params] = useRoute("/blog/:slug");
  const [article, setArticle] = useState(getArticleBySlug(params?.slug || ""));
  const [relatedArticles, setRelatedArticles] = useState<typeof blogArticles>([]);

  useEffect(() => {
    const foundArticle = getArticleBySlug(params?.slug || "");
    setArticle(foundArticle);

    if (foundArticle) {
      // Get related articles from same category
      const related = blogArticles
        .filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id)
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [params?.slug]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Article Not Found
          </h1>
          <p className="text-slate-400 mb-8" style={{ fontFamily: "var(--font-body)" }}>
            The article you're looking for doesn't exist.
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

  const readDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="py-16 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
        <div className="container relative z-10">
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6" style={{ textDecoration: "none", fontFamily: "var(--font-body)" }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </a>
          </Link>

          <div className="max-w-3xl">
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4"
              style={{
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.3)",
                color: "#60A5FA",
                fontFamily: "var(--font-mono)",
              }}
            >
              {article.category}
            </span>

            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              {article.title}
            </h1>

            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span style={{ fontFamily: "var(--font-body)" }}>{readDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: "var(--font-body)" }}>{article.readTime} min read</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)" }}>By {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 relative">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div
                className="prose prose-invert max-w-none"
                style={{
                  "--tw-prose-body": "#CBD5E1",
                  "--tw-prose-headings": "white",
                  "--tw-prose-links": "#00D4C8",
                  "--tw-prose-bold": "white",
                  "--tw-prose-code": "#60A5FA",
                } as any}
              >
                <div
                  className="text-slate-300 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .split("\n")
                      .map((line) => {
                        if (line.startsWith("# ")) {
                          return `<h1 style="font-size: 2em; font-weight: bold; margin: 1.5em 0 0.5em; font-family: var(--font-display); color: white;">${line.substring(2)}</h1>`;
                        }
                        if (line.startsWith("## ")) {
                          return `<h2 style="font-size: 1.5em; font-weight: bold; margin: 1.5em 0 0.5em; font-family: var(--font-display); color: white;">${line.substring(3)}</h2>`;
                        }
                        if (line.startsWith("### ")) {
                          return `<h3 style="font-size: 1.25em; font-weight: bold; margin: 1em 0 0.5em; font-family: var(--font-display); color: white;">${line.substring(4)}</h3>`;
                        }
                        if (line.startsWith("- ")) {
                          return `<li style="margin-left: 1.5em; margin-bottom: 0.5em;">${line.substring(2)}</li>`;
                        }
                        if (line.trim() === "") {
                          return "<br />";
                        }
                        return `<p style="margin-bottom: 1em; line-height: 1.6;">${line}</p>`;
                      })
                      .join(""),
                  }}
                />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(0,212,200,0.1)",
                        border: "1px solid rgba(0,212,200,0.2)",
                        color: "#00D4C8",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Share:
                </span>
                <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Share on LinkedIn">
                  <Share2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author card */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(13,27,46,0.5)",
                  border: "1px solid rgba(0,212,200,0.15)",
                }}
              >
                <h4
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  About the Author
                </h4>
                <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  {article.author} is an AI consulting expert with 12+ years of experience helping mid-sized organizations transform through AI and process mining.
                </p>
                <a
                  href="#"
                  className="text-sm font-semibold"
                  style={{ color: "#2563EB", textDecoration: "none" }}
                >
                  Follow on LinkedIn →
                </a>
              </div>

              {/* Newsletter CTA */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
                  border: "1px solid rgba(37,99,235,0.2)",
                }}
              >
                <h4
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Get More Insights
                </h4>
                <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  Subscribe to our weekly newsletter for AI insights and implementation strategies.
                </p>
                <a
                  href="#newsletter"
                  className="block text-center px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: "#2563EB",
                    color: "white",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Subscribe
                </a>
              </div>

              {/* Related articles */}
              {relatedArticles.length > 0 && (
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: "rgba(13,27,46,0.5)",
                    border: "1px solid rgba(0,212,200,0.15)",
                  }}
                >
                  <h4
                    className="text-white font-bold text-lg mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Related Articles
                  </h4>
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <Link key={related.id} href={`/blog/${related.slug}`}>
                        <a
                          className="block p-3 rounded-lg hover:bg-slate-800 transition-colors group"
                          style={{ textDecoration: "none" }}
                        >
                          <p
                            className="text-white text-sm font-semibold group-hover:text-cyan-400 transition-colors"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {related.title}
                          </p>
                          <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: "var(--font-body)" }}>
                            {related.readTime} min read
                          </p>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-12 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <a
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,212,200,0.15)",
                  color: "white",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
