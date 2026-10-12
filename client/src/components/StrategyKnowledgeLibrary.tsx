import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronDown, Copy, ExternalLink, FileImage, Search, ShieldCheck, X } from "lucide-react";
import knowledge from "@/lib/strategyKnowledge.json";
import { toast } from "sonner";

const themes = ["All topics", ...Array.from(new Set(knowledge.playbooks.map((item) => item.theme)))];
const sourceMap = new Map(knowledge.sources.map((source) => [source.id, source]));

export function filterStrategyPlaybooks(query: string, theme = "All topics") {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return knowledge.playbooks.filter((item) => {
    if (theme !== "All topics" && item.theme !== theme) return false;
    const searchable = [item.title, item.theme, item.summary, item.caution, ...item.checklist,
      ...item.sections.flatMap((section) => [section.title, section.body]),
      ...item.sources.map((id) => sourceMap.get(id)?.title ?? ""),
      ...item.sources.map((id) => `IMG_${id}.webp`)].join(" ").toLowerCase();
    return words.every((word) => searchable.includes(word));
  });
}

export default function StrategyKnowledgeLibrary() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All topics");
  const [view, setView] = useState<"playbooks" | "references">("playbooks");
  const [copied, setCopied] = useState<string | null>(null);
  const filtered = useMemo(() => filterStrategyPlaybooks(query, theme), [query, theme]);
  const referenceIds = new Set(filtered.flatMap((item) => item.sources));
  const references = knowledge.sources.filter((source) => referenceIds.has(source.id));

  const copyChecklist = async (item: typeof knowledge.playbooks[number]) => {
    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${item.checklist.map((step) => `[ ] ${step}`).join("\n")}\n\nLimitation: ${item.caution}`);
      setCopied(item.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Clipboard access is unavailable. You can select and copy the checklist text.");
    }
  };

  return (
    <section id="strategy-library" aria-labelledby="strategy-library-heading" className="scroll-mt-24 border-y border-cyan-400/15 bg-[#07111f] py-12 sm:py-16">
      <div className="container">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">Strategy field guide / Knowledge into practice</p>
            <h2 id="strategy-library-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Build the strategy.<br /><span className="gradient-text">Understand the system.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">A practical synthesis of the supplied architecture maps, agent guides, tool references, and leadership material. Explore the concepts, test the tradeoffs, and turn the checklists into your own delivery plan.</p>
          </div>
          <div className="flex gap-6 rounded-xl border border-cyan-400/15 bg-[#0D1B2E] px-6 py-5">
            <div><span className="block font-mono text-3xl font-semibold text-white">{knowledge.playbooks.length}</span><span className="text-xs text-slate-400">Practical playbooks</span></div>
            <div className="border-l border-cyan-400/15 pl-6"><span className="block font-mono text-3xl font-semibold text-cyan-300">{knowledge.sources.length}</span><span className="text-xs text-slate-400">Source references</span></div>
          </div>
        </div>

        <div className="mb-7 flex gap-3 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.035] p-4 sm:p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
          <p className="text-xs leading-6 text-slate-300"><strong className="text-white">Educational material, not deployed tools.</strong> Summaries are paraphrased from the supplied screenshots; originals remain third-party reference material, not AI-CoreLogic endorsements. Product features, certification offers, prices, and performance claims are not independently verified. Each playbook includes its own limitations. Updated {knowledge.updated}.</p>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="strategy-search" className="sr-only">Search AI Strategy knowledge and source references</label>
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" aria-hidden="true" />
            <input id="strategy-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search MCP, RAG, governance, costs, leadership…" className="h-12 w-full rounded-lg border border-slate-700 bg-[#050B18] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15" />
          </div>
          <div className="flex shrink-0 rounded-lg border border-slate-700 p-1" aria-label="Library view">
            <button type="button" aria-pressed={view === "playbooks"} onClick={() => setView("playbooks")} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors ${view === "playbooks" ? "bg-cyan-400/10 text-cyan-300" : "text-slate-400 hover:text-white"}`}><BookOpen className="h-4 w-4" />Playbooks</button>
            <button type="button" aria-pressed={view === "references"} onClick={() => setView("references")} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors ${view === "references" ? "bg-cyan-400/10 text-cyan-300" : "text-slate-400 hover:text-white"}`}><FileImage className="h-4 w-4" />References</button>
          </div>
        </div>
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter by Strategy topic">
          {themes.map((option) => <button type="button" key={option} aria-pressed={theme === option} onClick={() => setTheme(option)} className={`min-h-10 rounded-full border px-4 py-2 text-xs transition-colors ${theme === option ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-slate-700 bg-transparent text-slate-400 hover:border-slate-500 hover:text-white"}`}>{option}</button>)}
        </div>
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500" role="status" aria-live="polite">{filtered.length} playbooks · {references.length} references{query ? ` · “${query}”` : ""}</p>
          {(query || theme !== "All topics") && <button type="button" onClick={() => { setQuery(""); setTheme("All topics"); }} className="flex min-h-10 items-center gap-1 text-xs text-cyan-300 hover:text-white"><X className="h-3.5 w-3.5" />Clear filters</button>}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
            <Search className="mx-auto mb-4 h-7 w-7 text-slate-500" />
            <h3 className="font-semibold text-white">No matching material</h3><p className="mt-2 text-sm text-slate-400">Try a broader term or choose a different topic.</p>
          </div>
        ) : view === "playbooks" ? (
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {filtered.map((item) => <details key={item.id} id={`strategy-${item.id}`} className="group scroll-mt-24 overflow-hidden rounded-xl border border-cyan-400/10 bg-[#0D1B2E]/60 open:border-cyan-400/30">
              <summary className="cursor-pointer list-none p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 sm:p-6 [&::-webkit-details-marker]:hidden">
                <div className="mb-3 flex items-center justify-between gap-4"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-400">{item.theme}</span><ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180 group-open:text-cyan-400" aria-hidden="true" /></div>
                <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.summary}</p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-slate-500">Read playbook / {item.sources.length} source {item.sources.length === 1 ? "reference" : "references"}</p>
              </summary>
              <div className="border-t border-cyan-400/10 px-5 pb-6 pt-5 sm:px-6">
                <div className="space-y-5">{item.sections.map((section) => <section key={section.title}><h4 className="mb-2 text-sm font-semibold text-white">{section.title}</h4><p className="text-sm leading-7 text-slate-300">{section.body}</p></section>)}</div>
                <div className="mt-6 rounded-lg border border-cyan-400/15 bg-[#050B18]/70 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3"><h4 className="text-xs font-semibold text-cyan-300">Put it into practice</h4><button type="button" onClick={() => copyChecklist(item)} className="flex min-h-9 items-center gap-1.5 rounded px-2 text-[11px] text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400" aria-label={`Copy checklist: ${item.title}`}>{copied === item.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied === item.id ? "Copied" : "Copy"}</button></div>
                  <ul className="space-y-3">{item.checklist.map((step) => <li key={step} className="flex gap-3 text-xs leading-6 text-slate-300"><span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm border border-cyan-400/30" aria-hidden="true" />{step}</li>)}</ul>
                </div>
                <p className="mt-5 border-l-2 border-amber-400/40 pl-3 text-xs leading-6 text-slate-400"><strong className="text-amber-200">Important qualification: </strong>{item.caution}</p>
                <details className="mt-5"><summary className="cursor-pointer py-2 text-xs font-semibold text-cyan-300">Source references ({item.sources.length})</summary><ul className="mt-2 space-y-3">{item.sources.map((id) => { const source = sourceMap.get(id)!; return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 rounded-lg border border-slate-700 p-3 text-xs leading-5 text-slate-300 transition-colors hover:border-cyan-400/30 hover:text-white"><span>{source.title}<span className="mt-1 block font-mono text-[9px] text-slate-500">{source.file} · Supplied screenshot</span></span><ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-cyan-400" aria-label="Opens in a new tab" /></a></li>; })}</ul></details>
              </div>
            </details>)}
          </div>
        ) : (
          <>
            <p className="mb-5 text-xs leading-6 text-slate-400">All {knowledge.sources.length} supplied screenshots are indexed. Original author names and attribution remain visible in each image. Some sources overlap; related material is consolidated into playbooks rather than repeated.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{references.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border border-slate-700 bg-[#0D1B2E] outline-none transition-colors hover:border-cyan-400/40 focus-visible:ring-2 focus-visible:ring-cyan-400">
              <div className="flex h-48 items-center justify-center overflow-hidden border-b border-slate-700 bg-[#050B18]"><img src={source.url} alt={`Original supplied reference: ${source.title}`} loading="lazy" decoding="async" className="h-full w-full object-contain" width={942} height={2048} /></div>
              <div className="p-4"><p className="mb-2 font-mono text-[9px] tracking-wide text-slate-500">{source.file}</p><h3 className="text-sm font-semibold leading-6 text-white group-hover:text-cyan-300">{source.title}</h3><span className="mt-3 flex items-center gap-2 text-[11px] text-cyan-300">Open full reference<ExternalLink className="h-3 w-3" /></span></div>
            </a>)}</div>
          </>
        )}
      </div>
    </section>
  );
}
