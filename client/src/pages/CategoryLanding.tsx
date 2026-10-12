/* AI-CoreLogic category pages — existing articles plus the AI Strategy knowledge library. */
import { useRoute, Link } from "wouter";
import { getArticlesByCategory, categories } from "@/lib/blogData";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo } from "react";

const StrategyKnowledgeLibrary = lazy(() => import("@/components/StrategyKnowledgeLibrary"));
const categoryMetadata: Record<string, { title: string; description: string; icon: string; color: string }> = {
  "AI Strategy": { title: "AI Strategy & Planning", description: "Connect business outcomes to the architecture, knowledge, controls, and people that make AI work. Explore practical playbooks and original references alongside our existing strategy articles.", icon: "", color: "#00D4C8" },
  "Process Mining": { title: "Process Mining & Optimization", description: "Discover how process mining uncovers hidden inefficiencies, automates workflows, and drives operational transformation for mid-sized organizations.", icon: "⚙️", color: "#00D4C8" },
  "AI Technology": { title: "AI Technology & Implementation", description: "Technical deep-dives on deploying LLMs, machine learning models, and AI systems safely and effectively in enterprise environments.", icon: "🚀", color: "#60A5FA" },
  "Change Management": { title: "Change Management & Adoption", description: "Master the human side of AI transformation with proven strategies for organizational change, stakeholder engagement, and sustainable adoption.", icon: "🔄", color: "#A78BFA" },
  "Business Value": { title: "Business Value & ROI", description: "Learn how to measure AI impact, quantify ROI, and build compelling business cases for continued AI investment and scaling.", icon: "💼", color: "#34D399" },
};

export function resolveCategory(slug: string | undefined) {
  return categories.find((category) => category !== "All" && category.toLowerCase().replace(/\s+/g, "-") === slug) ?? null;
}

export default function CategoryLanding() {
  const [, params] = useRoute("/category/:slug");
  const category = resolveCategory(params?.slug);
  const metadata = category ? categoryMetadata[category] : null;
  const articles = useMemo(() => category ? getArticlesByCategory(category) : [], [category]);
  const isStrategy = category === "AI Strategy";

  useEffect(() => {
    document.title = metadata ? `${metadata.title} | AI-CoreLogic` : "Category Not Found | AI-CoreLogic";
    const description = document.querySelector('meta[name="description"]');
    const previous = description?.getAttribute("content");
    if (metadata) description?.setAttribute("content", metadata.description);
    return () => { if (previous) description?.setAttribute("content", previous); };
  }, [metadata]);

  if (!category || !metadata) return (
    <main className="flex min-h-screen items-center justify-center bg-[#050B18] px-4 text-center text-white">
      <div><h1 className="mb-4 text-4xl font-bold">Category Not Found</h1><p className="mb-8 text-slate-400">The category you're looking for doesn't exist.</p><Link href="/blog" className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 px-6 py-3 text-cyan-300"><ArrowLeft className="h-4 w-4" />Back to Blog</Link></div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-300">
      <header className="border-b border-cyan-400/15 bg-[#07111f]">
        <div className="container flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>AI-<span className="gradient-text">CoreLogic</span></Link>
          <nav aria-label="Category navigation" className="flex flex-wrap items-center gap-4 text-xs sm:gap-6"><Link href="/" className="text-slate-400 hover:text-cyan-300">Home</Link><Link href="/blog" className="text-slate-400 hover:text-cyan-300">Blog</Link><a href="/#industries" className="text-slate-400 hover:text-cyan-300">Industries</a><a href="/#contact" className="rounded-lg border border-cyan-400/25 px-3 py-2 text-cyan-300 hover:bg-cyan-400/5">Discuss your strategy</a></nav>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden bg-[#0D1B2E] py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,200,0.08),transparent_60%)]" />
          <div className="container relative">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300"><ArrowLeft className="h-3.5 w-3.5" />Back to Blog</Link>
            <div className="max-w-4xl">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">{category} / Applied knowledge</p>
              <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>{metadata.title}</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">{metadata.description}</p>
              {isStrategy && <div className="mt-7 flex flex-wrap gap-3"><a href="#strategy-library" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-400/30 hover:bg-cyan-400/15"><BookOpen className="h-4 w-4" />Explore the knowledge library</a><a href="#category-articles" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:text-white">Read strategy articles<ArrowRight className="h-4 w-4" /></a></div>}
            </div>
          </div>
        </section>
        {isStrategy && <Suspense fallback={<div className="container py-16 text-sm text-slate-400" role="status">Loading the AI Strategy knowledge library…</div>}><StrategyKnowledgeLibrary /></Suspense>}
        <section className="border-b border-slate-800 py-7">
          <div className="container grid grid-cols-3 gap-4 text-center">
            <div><span className="block font-mono text-2xl font-semibold text-white">{articles.length}</span><span className="text-xs text-slate-500">Existing articles</span></div>
            <div><span className="block font-mono text-2xl font-semibold text-white">{articles.length ? Math.round(articles.reduce((sum, article) => sum + article.readTime, 0) / articles.length) : 0} min</span><span className="text-xs text-slate-500">Average article read</span></div>
            <div><span className="block font-mono text-2xl font-semibold text-white">{articles.filter((article) => article.featured).length}</span><span className="text-xs text-slate-500">Featured articles</span></div>
          </div>
        </section>
        <section id="category-articles" className="scroll-mt-8 py-12 sm:py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>All {category} Articles</h2>
            {articles.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <Link key={article.id} href={`/blog/${article.slug}`} className="group flex h-full flex-col rounded-xl border border-cyan-400/15 bg-[#0D1B2E]/50 p-6 transition-colors hover:border-cyan-400/40">
              <span className="mb-4 font-mono text-[9px] uppercase tracking-widest text-cyan-400">{article.category}</span>
              <h3 className="mb-3 text-lg font-semibold text-white group-hover:text-cyan-300">{article.title}</h3>
              <p className="mb-5 flex-1 text-sm leading-6 text-slate-400">{article.excerpt}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{article.readTime} min</span><ArrowRight className="h-4 w-4 text-cyan-400" /></div>
            </Link>)}</div> : <p className="text-slate-400">No articles in this category yet.</p>}
          </div>
        </section>
        <section className="border-t border-slate-800 py-12">
          <div className="container"><h2 className="mb-6 text-xl font-semibold text-white">Explore Other Topics</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.filter((item) => item !== "All" && item !== category).map((item) => <Link key={item} href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-xl border border-slate-700 bg-[#0D1B2E]/50 p-5 hover:border-cyan-400/30"><h3 className="mb-2 text-sm font-semibold text-white">{item}</h3><p className="text-xs text-slate-500">{getArticlesByCategory(item).length} articles</p></Link>)}</div></div>
        </section>
        <section className="container py-12"><div className="rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 p-6 sm:p-8"><h2 className="text-xl font-semibold text-white">Turn knowledge into an operating plan.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Discuss your organization’s priorities, architecture choices, and adoption roadmap with AI-CoreLogic—or follow our research for further practical guidance.</p><div className="mt-5 flex flex-wrap gap-3"><a href="/#contact" className="rounded-lg border border-cyan-400/30 px-5 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/5">Request a strategy briefing</a><a href="/#newsletter" className="rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:text-white">Subscribe to insights</a></div></div></section>
      </main>
      <footer className="border-t border-slate-800 py-6"><div className="container flex flex-wrap justify-between gap-3 text-xs text-slate-500"><span>© {new Date().getFullYear()} AI-CoreLogic</span><Link href="/" className="text-cyan-400 hover:text-cyan-300">Return to homepage</Link></div></footer>
    </div>
  );
}
