import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import "@/intelligence.css";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ChevronDown,
  Clipboard,
  ExternalLink,
  FileCheck2,
  Loader2,
  Menu,
  MessageCircle,
  Printer,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  relativePerformance,
  researchBrief,
  researchCompanies,
  yahooFinanceSource,
  type ResearchCompany,
} from "@/lib/intelligenceData";
import {
  fetchLiveStockQuote,
  formatMarketPrice,
  searchLiveStocks,
  type LiveStockResult,
} from "@/lib/marketData";
import { popularStocks } from "@/lib/stockDirectory";
import {
  authorizeStockSummaryAI,
  generateStockSummary,
  stockSummaryStyles,
  type StockSummaryResult,
  type StockSummaryStyle,
} from "@/lib/stockSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navigation = [
  { label: "Briefing", href: "#briefing", index: "01" },
  { label: "Evidence", href: "#evidence", index: "02" },
  { label: "Signals", href: "#signals", index: "03" },
  { label: "Compare", href: "#comparison", index: "04" },
  { label: "Sources", href: "#sources", index: "05" },
];

const protocol = [
  { index: "01", title: "Resolve entities", detail: "Ticker, listing, fiscal calendar" },
  { index: "02", title: "Collect primary sources", detail: "IR releases + dated market snapshot" },
  { index: "03", title: "Normalize basis", detail: "Keep GAAP, non-GAAP & periods distinct" },
  { index: "04", title: "Compare signals", detail: "Compute only traceable derived metrics" },
];

const readouts = [
  {
    ticker: "SNDK",
    text: "Memory-cycle upside shows in pricing and a sharp Datacenter mix shift, with the strongest direct commodity sensitivity.",
  },
  {
    ticker: "AMZN",
    text: "AWS acceleration supplies the operating leverage, while capital intensity makes cash flow the important counterweight.",
  },
  {
    ticker: "NVDA",
    text: "Data Center concentration produces exceptional demand exposure, alongside policy and supply-chain sensitivity.",
  },
  {
    ticker: "MU",
    text: "HBM and DRAM pricing translate AI demand into exceptional revenue and cash-flow acceleration, with cyclical supply risk.",
  },
];

const guardrails = [
  {
    title: "Keep the fiscal clocks visible.",
    detail: "SNDK reports a late-June fiscal year; NVIDIA reports a late-January fiscal year; Micron uses a late-August fiscal year; Amazon uses the calendar year.",
  },
  {
    title: "Do not elevate headline net income.",
    detail: "Amazon’s Q2 net income includes a material non-operating investment-related item. Operating metrics carry the cleaner comparison.",
  },
  {
    title: "Different infrastructure roles.",
    detail: "These companies serve adjacent parts of the stack; the dashboard compares signals rather than asserting one business model is identical.",
  },
];

const chartColors: Record<ResearchCompany["ticker"], string> = {
  SNDK: "#f97360",
  AMZN: "#4f8cff",
  NVDA: "#00D4C8",
  MU: "#aa7dff",
};

const comparisonColors = ["#f97360", "#4f8cff", "#00D4C8", "#aa7dff"];
const comparisonStorageKey = "ai-corelogic-stock-comparison";
const summaryStyleStorageKey = "ai-corelogic-summary-style";
const defaultComparisonStocks: LiveStockResult[] = researchCompanies.map((company) => ({
  symbolKey: `NASDAQ:${company.ticker}`,
  ticker: company.ticker,
  name: company.name,
  exchange: "NASDAQ",
  price: company.price,
  changePercent: company.dayMove,
  currency: "USD",
  marketCap: null,
  peRatio: null,
  eps: null,
  dividendYield: null,
  revenue: null,
  revenueGrowth: null,
  rsi: null,
  macd: null,
  macdSignal: null,
  sma20: null,
  sma50: null,
  dailyVolatility: null,
}));

function loadSavedComparison() {
  if (typeof window === "undefined") return defaultComparisonStocks;
  try {
    const saved = JSON.parse(window.localStorage.getItem(comparisonStorageKey) || "null") as LiveStockResult[] | null;
    if (
      Array.isArray(saved) &&
      saved.length === 4 &&
      saved.every((stock) => stock && typeof stock.ticker === "string" && typeof stock.exchange === "string")
    ) {
      return saved;
    }
  } catch {
    // Ignore malformed local state and restore the verified default basket.
  }
  return defaultComparisonStocks;
}

function loadSummaryStyle(): StockSummaryStyle {
  if (typeof window === "undefined") return "technical";
  const saved = window.localStorage.getItem(summaryStyleStorageKey);
  return saved === "technical" || saved === "fundamental" || saved === "beginner" ? saved : "technical";
}

function IntelligenceMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="intelligence-mark" aria-hidden="true">
      <span className="intelligence-mark__line" />
      <span className="intelligence-mark__line intelligence-mark__line--offset" />
      {!compact && <span className="intelligence-mark__pulse" />}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-end">
      <div>
        <div className="intelligence-kicker mb-3">{eyebrow}</div>
        <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-sm leading-7 text-slate-400 lg:text-right">{description}</p>
      )}
    </div>
  );
}

function StockSelectionPanel({
  slot,
  selectedKeys,
  onSelect,
  onClose,
}: {
  slot: number;
  selectedKeys: string[];
  onSelect: (stock: LiveStockResult) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LiveStockResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      try {
        const [matches, primaryMatches] = await Promise.all([
          searchLiveStocks(normalized, controller.signal),
          Promise.all(
            popularStocks
              .filter(
                (stock) =>
                  stock.ticker.toLowerCase().startsWith(normalized.toLowerCase()) ||
                  stock.name.toLowerCase().includes(normalized.toLowerCase())
              )
              .slice(0, 4)
              .map((stock) => fetchLiveStockQuote(stock.ticker, stock.exchange, controller.signal))
          ),
        ]);
        const unique = new Map<string, LiveStockResult>();
        primaryMatches
          .filter((stock): stock is LiveStockResult => Boolean(stock))
          .forEach((stock) => unique.set(stock.symbolKey, stock));
        matches.forEach((stock) => {
          if (!unique.has(stock.symbolKey)) unique.set(stock.symbolKey, stock);
        });
        setResults(
          Array.from(unique.values())
            .filter((stock) => !selectedKeys.includes(stock.symbolKey))
            .slice(0, 8)
        );
        setStatus("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResults([]);
        setStatus("error");
      }
    }, 260);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedKeys]);

  return (
    <div className="mb-8 border border-cyan-400/20 bg-[#050d18] p-4 sm:p-5 print:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="intelligence-kicker">Replace slot 0{slot + 1}</div>
          <p className="mt-2 text-sm text-slate-400">Search a ticker or company across global exchanges.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-slate-500 transition-colors hover:text-white" aria-label="Close stock selector">
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="relative mt-5 block">
        {status === "loading" ? (
          <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-cyan-400" />
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        )}
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try AAPL, Microsoft, Toyota, Shell…"
          autoFocus
          autoComplete="off"
          aria-label={`Search replacement stock for comparison slot ${slot + 1}`}
          className="h-11 w-full rounded-lg border border-cyan-400/15 bg-[#030810] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/45 focus:outline-none"
        />
      </label>

      <div className="mt-3" aria-live="polite">
        {status === "idle" && (
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">Live global ticker directory</p>
        )}
        {status === "error" && (
          <p className="text-xs text-rose-300">The live directory is temporarily unavailable. Try again shortly.</p>
        )}
        {status === "ready" && results.length === 0 && (
          <p className="text-xs text-slate-500">No unselected stock matched that search.</p>
        )}
        {results.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" role="listbox" aria-label="Replacement stock results">
            {results.map((stock) => (
              <button
                type="button"
                key={stock.symbolKey}
                onClick={() => onSelect(stock)}
                className="flex items-center justify-between gap-3 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025] p-3 text-left transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
                role="option"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-[0.12em] text-white">{stock.ticker}</span>
                  <span className="mt-1 block truncate text-[11px] text-slate-500">{stock.name} · {stock.exchange}</span>
                </span>
                <span className="shrink-0 text-right font-mono">
                  <span className="block text-[9px] text-white">{stock.price !== null ? formatMarketPrice(stock.price, stock.currency) : "—"}</span>
                  <span className={`mt-1 block text-[8px] ${stock.changePercent !== null && stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {stock.changePercent !== null ? `${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%` : "—"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResearchHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="intelligence-header print:hidden">
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-5 lg:h-20">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-3 text-white"
              aria-label="Back to AI-Corelogic homepage"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/logo_8ad417ef.png"
                alt="AI-Corelogic"
                className="h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80 lg:h-11"
              />
              <span className="hidden border-l border-cyan-400/20 pl-3 sm:block">
                <span className="block font-mono text-[9px] tracking-[0.16em] text-slate-400">FINANCIAL STOCK ANALYSIS</span>
                <span className="mt-1 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.16em] text-cyan-400">
                  <i className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,200,0.8)]" />
                  SOURCE-FORWARD
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Financial Stock Analysis sections">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="intelligence-nav-link">
                <span>{item.index}</span> {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/" className="intelligence-home-link">
              <ArrowLeft className="h-3.5 w-3.5" /> Main site
            </Link>
            <a
              href="https://wa.me/17273189265?text=Hi%20Rodney%2C%20I%27d%20like%20to%20discuss%20AI-Corelogic%20Financial%20Stock%20Analysis."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-lg px-4 py-2.5 text-xs"
            >
              Discuss a signal
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-cyan-400/20 p-2 text-slate-300 transition-colors hover:text-cyan-400 lg:hidden"
            aria-label="Toggle Financial Stock Analysis navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-cyan-400/10 py-4 lg:hidden">
            <div className="grid gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-cyan-400/5 hover:text-cyan-400"
                >
                  {item.label}
                  <span className="font-mono text-[10px] text-slate-600">{item.index}</span>
                </a>
              ))}
              <Link
                href="/"
                className="mt-2 flex items-center gap-2 border-t border-cyan-400/10 px-3 pt-4 text-sm text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" /> Return to AI-Corelogic
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default function IntelligenceDesk() {
  const [activeTicker, setActiveTicker] = useState<"all" | ResearchCompany["ticker"]>(() => {
    const requestedTicker = new URLSearchParams(window.location.search).get("ticker")?.toUpperCase();
    const company = researchCompanies.find((item) => item.ticker === requestedTicker);
    return company?.ticker ?? "all";
  });
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comparisonStocks, setComparisonStocks] = useState<LiveStockResult[]>(loadSavedComparison);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [comparisonRefreshing, setComparisonRefreshing] = useState(false);
  const [stockSummary, setStockSummary] = useState<StockSummaryResult | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState<StockSummaryStyle>(loadSummaryStyle);

  const comparisonSignature = comparisonStocks
    .map((stock) => `${stock.symbolKey}:${stock.price ?? "na"}:${stock.changePercent ?? "na"}`)
    .join("|");

  useEffect(() => {
    window.localStorage.setItem(comparisonStorageKey, JSON.stringify(comparisonStocks));
  }, [comparisonStocks]);

  useEffect(() => {
    window.localStorage.setItem(summaryStyleStorageKey, summaryStyle);
    setStockSummary(null);
    setSummaryCopied(false);
  }, [summaryStyle]);

  useEffect(() => {
    setStockSummary(null);
    setSummaryCopied(false);
  }, [comparisonSignature]);

  useEffect(() => {
    const controller = new AbortController();
    const refreshInitialQuotes = async () => {
      const refreshed = await Promise.all(
        comparisonStocks.map(async (stock) => {
          try {
            return (await fetchLiveStockQuote(stock.ticker, stock.exchange, controller.signal)) ?? stock;
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return stock;
            return stock;
          }
        })
      );
      if (!controller.signal.aborted) setComparisonStocks(refreshed);
    };
    void refreshInitialQuotes();
    return () => controller.abort();
    // The initial basket is refreshed once; later changes arrive with live data from the picker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Financial Stock Analysis | AI-Corelogic";
    const hash = window.location.hash;
    window.requestAnimationFrame(() => {
      if (hash) {
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const visibleCompanies = useMemo(
    () =>
      activeTicker === "all"
        ? researchCompanies
        : researchCompanies.filter((company) => company.ticker === activeTicker),
    [activeTicker]
  );

  const revenueData = researchCompanies.map((company) => ({
    company: company.ticker,
    revenue: company.revenue,
    fill: company.accent,
  }));

  const growthData = researchCompanies.map((company) => ({
    company: company.ticker,
    growth: company.growth,
    fill: company.accent,
  }));

  const replaceComparisonStock = (slot: number, stock: LiveStockResult) => {
    setComparisonStocks((current) => current.map((item, index) => (index === slot ? stock : item)));
    setEditingSlot(null);
    toast.success(`${stock.ticker} added to comparison slot 0${slot + 1}`);
  };

  const refreshComparisonStocks = async () => {
    setComparisonRefreshing(true);
    const refreshed = await Promise.all(
      comparisonStocks.map(async (stock) => {
        try {
          return (await fetchLiveStockQuote(stock.ticker, stock.exchange)) ?? stock;
        } catch {
          return stock;
        }
      })
    );
    setComparisonStocks(refreshed);
    setComparisonRefreshing(false);
    toast.success("Live comparison refreshed");
  };

  const generateComparisonBrief = async () => {
    setSummaryLoading(true);
    setStockSummary(null);
    setSummaryCopied(false);
    try {
      const aiAuthorized = await authorizeStockSummaryAI();
      const refreshed = await Promise.all(
        comparisonStocks.map(async (stock) => {
          try {
            return (await fetchLiveStockQuote(stock.ticker, stock.exchange)) ?? stock;
          } catch {
            return stock;
          }
        })
      );
      setComparisonStocks(refreshed);
      const result = await generateStockSummary(refreshed, summaryStyle, aiAuthorized);
      setStockSummary(result);
      if (result.mode === "ai") {
        toast.success(`${stockSummaryStyles[summaryStyle].label} analysis generated`);
      } else {
        toast.info("AI provider unavailable — metrics brief generated instead");
      }
    } catch {
      toast.error("The comparison brief could not be generated. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const copyStockSummary = async () => {
    if (!stockSummary) return;
    try {
      await navigator.clipboard.writeText(stockSummary.text);
      setSummaryCopied(true);
      toast.success("Comparison brief copied");
      window.setTimeout(() => setSummaryCopied(false), 1800);
    } catch {
      toast.error("Clipboard access was unavailable.");
    }
  };

  const resetComparisonStocks = () => {
    setComparisonStocks(defaultComparisonStocks);
    setEditingSlot(null);
    toast.success("Default comparison restored");
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(researchBrief);
      setCopied(true);
      toast.success("Research brief copied to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard access was unavailable. Select and copy the brief manually.");
    }
  };

  return (
    <div className="intelligence-page min-h-screen bg-[#050B18] text-slate-100">
      <ResearchHeader />

      <main>
        <section id="briefing" className="intelligence-hero scroll-mt-24">
          <div className="intelligence-hero__grid" aria-hidden="true" />
          <div className="container relative z-10 py-16 sm:py-20 lg:py-28">
            <div className="grid gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-14">
              <aside className="hidden border-r border-cyan-400/10 pr-8 xl:block">
                <div className="sticky top-28">
                  <div className="mb-8 flex items-center gap-3">
                    <IntelligenceMark />
                    <div>
                      <p className="font-display text-lg font-bold leading-none text-white">SIGNAL</p>
                      <p className="font-display text-lg font-bold leading-none text-white">LEDGER</p>
                    </div>
                  </div>
                  <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.18em] text-slate-500">
                    AI-Corelogic<br />independent research desk<br />edition 01 / 2026
                  </p>
                  <div className="mt-10 space-y-3">
                    {navigation.map((item) => (
                      <a key={item.href} href={item.href} className="intelligence-rail-link">
                        <span>{item.index}</span>
                        {item.label}
                      </a>
                    ))}
                  </div>
                  <div className="mt-12 border-t border-cyan-400/10 pt-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Snapshot status</p>
                    <p className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-400">
                      <i className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,200,0.8)]" />
                      Verified at publication
                    </p>
                    <p className="mt-2 font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-slate-600">
                      06 Sep 2026<br />Market close 04 Sep 2026
                    </p>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                  <span className="text-cyan-400">SNDK / AMZN / NVDA / MU</span>
                  <span className="h-3 w-px bg-slate-700" />
                  <span>Comparative research</span>
                  <span className="h-3 w-px bg-slate-700" />
                  <span>As of 06 Sep 2026</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                  <div>
                    <div className="mb-5 flex items-center gap-3 xl:hidden">
                      <IntelligenceMark />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Signal Ledger / 01</span>
                    </div>
                    <h1 className="max-w-5xl text-[clamp(3rem,4.7vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.06em] text-white">
                      Four earnings stories.
                      <span className="mt-2 block gradient-text">One infrastructure cycle.</span>
                    </h1>
                    <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                      A source-forward comparative read on memory pricing, cloud monetization, and accelerated-compute demand. The analysis deliberately keeps fiscal periods and accounting bases visible.
                    </p>
                  </div>

                  <div className="intelligence-orbit-panel">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Research mode</span>
                      <Radar className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="mt-6 space-y-4">
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-600">Basis</span>
                        <p className="mt-1 text-sm text-white">Primary releases</p>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-600">Positioning</span>
                        <p className="mt-1 text-sm text-white">No price targets</p>
                      </div>
                      <div className="flex items-center gap-2 border-t border-cyan-400/10 pt-4 text-xs text-cyan-400">
                        <ShieldCheck className="h-4 w-4" /> Traceable conclusions
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-9 flex flex-wrap gap-3 print:hidden">
                  <a href="#evidence" className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm">
                    Review the evidence <ArrowRight className="h-4 w-4" />
                  </a>
                  <button type="button" onClick={copyBrief} className="intelligence-action">
                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy brief"}
                  </button>
                  <button type="button" onClick={() => window.print()} className="intelligence-action">
                    <Printer className="h-4 w-4" /> Save / print
                  </button>
                </div>

                <div className="mt-12 grid border-y border-cyan-400/10 sm:grid-cols-2 xl:grid-cols-4">
                  {researchCompanies.map((company, index) => (
                    <button
                      type="button"
                      key={company.ticker}
                      onClick={() => {
                        setActiveTicker(company.ticker);
                        document.querySelector("#evidence")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="intelligence-signal-cell text-left"
                    >
                      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-slate-600">
                        0{index + 1} / {company.ticker}
                      </span>
                      <span className="mt-2 block text-xs font-semibold leading-5" style={{ color: company.accent }}>
                        {company.engine}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 border border-cyan-400/10 bg-[#07111f]/80 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Activity className="h-3.5 w-3.5" /> Static verified research snapshot
                  </span>
                  <span>Published 06 Sep 2026 · Close 04 Sep 2026</span>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                  <div className="intelligence-panel p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="intelligence-kicker">Agent readout</div>
                        <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                          Demand is shared; operating transmission is not.
                        </h2>
                      </div>
                      <Sparkles className="hidden h-6 w-6 text-cyan-400 sm:block" />
                    </div>
                    <div className="mt-7 grid gap-6 border-t border-cyan-400/10 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                      {readouts.map((item) => (
                        <div key={item.ticker}>
                          <span className="font-mono text-[9px] tracking-[0.16em]" style={{ color: chartColors[item.ticker as ResearchCompany["ticker"]] }}>
                            {item.ticker}
                          </span>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="intelligence-panel intelligence-panel--dark p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="intelligence-kicker">Research protocol</div>
                      <Activity className="h-5 w-5 text-cyan-400" />
                    </div>
                    <ol className="space-y-5">
                      {protocol.map((step) => (
                        <li key={step.index} className="grid grid-cols-[28px_1fr] gap-3">
                          <span className="font-mono text-[9px] text-cyan-400">{step.index}</span>
                          <div>
                            <p className="text-sm font-semibold text-white">{step.title}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="evidence" className="scroll-mt-20 border-y border-cyan-400/10 bg-[#07111f] py-20 lg:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Latest reported evidence"
              title="The company files"
              description="Select a company to foreground its specific evidence. All figures retain their original reporting period and scope."
            />

            <div className="mb-8 flex flex-wrap gap-2 print:hidden" role="group" aria-label="Filter evidence by company">
              <button
                type="button"
                onClick={() => setActiveTicker("all")}
                aria-pressed={activeTicker === "all"}
                className={`intelligence-filter ${activeTicker === "all" ? "intelligence-filter--active" : ""}`}
              >
                All companies
              </button>
              {researchCompanies.map((company) => (
                <button
                  type="button"
                  key={company.ticker}
                  onClick={() => setActiveTicker(company.ticker)}
                  aria-pressed={activeTicker === company.ticker}
                  className={`intelligence-filter ${activeTicker === company.ticker ? "intelligence-filter--active" : ""}`}
                >
                  <i className="h-1.5 w-1.5 rounded-full" style={{ background: company.accent }} />
                  {company.ticker}
                </button>
              ))}
            </div>

            <div className={`grid gap-5 ${activeTicker === "all" ? "md:grid-cols-2 xl:grid-cols-4" : "max-w-4xl"}`}>
              {visibleCompanies.map((company, index) => (
                <article key={company.ticker} className="intelligence-evidence-card" style={{ "--company-accent": company.accent } as CSSProperties}>
                  <div className="intelligence-evidence-card__topline" />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                        Evidence / {company.ticker} / 0{researchCompanies.findIndex((item) => item.ticker === company.ticker) + 1}
                      </span>
                      <span className="rounded border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-500">
                        {company.period}
                      </span>
                    </div>

                    <div className="mt-8 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: company.accent }}>
                          Primary release
                        </p>
                        <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">{company.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">{company.thesis}</p>
                      </div>
                      <a
                        href={company.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/10 p-2 text-slate-500 transition-colors hover:border-cyan-400/30 hover:text-cyan-400"
                        aria-label={`Open ${company.name} primary source`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      <div className="intelligence-metric">
                        <span>Revenue</span>
                        <strong>${company.revenue.toFixed(company.revenue < 10 ? 2 : company.revenue % 1 ? 2 : 1)}B</strong>
                      </div>
                      <div className="intelligence-metric">
                        <span>Growth</span>
                        <strong style={{ color: company.accent }}>+{company.growth}%</strong>
                      </div>
                    </div>
                    <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">{company.growthLabel}</p>

                    <p className="mt-6 text-sm leading-6 text-slate-300">{company.readout}</p>
                    <div className="mt-6 border-t border-cyan-400/10 pt-5">
                      <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-cyan-400">Catalyst</span>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{company.catalyst}</p>
                    </div>
                    {activeTicker !== "all" && (
                      <div className="mt-5 border-t border-rose-400/10 pt-5">
                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-rose-300">Risk transmission</span>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{company.risk}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="signals" className="scroll-mt-20 py-20 lg:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Scale & momentum"
              title="One cycle, four operating transmissions"
              description="Revenue periods are not calendar-aligned. Growth bases remain explicit rather than being collapsed into one inferred ranking."
            />

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="intelligence-panel p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="intelligence-kicker">Latest revenue</div>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">Reported scale</h3>
                  </div>
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="mt-7 h-[300px]" aria-label="Latest reported revenue bar chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                      <XAxis dataKey="company" tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(0,212,200,0.04)" }}
                        contentStyle={{ background: "#07111f", border: "1px solid rgba(0,212,200,0.2)", borderRadius: 8, color: "#F8FAFC", fontSize: 12 }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}B`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
                        {revenueData.map((entry) => <Cell key={entry.company} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">
                  <span>USD billions</span><span>Latest disclosed fiscal period</span><span>Periods not calendar-aligned</span>
                </div>
              </div>

              <div className="intelligence-panel p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="intelligence-kicker">Growth rate</div>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">Reported revenue change</h3>
                  </div>
                  <Activity className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="mt-7 h-[300px]" aria-label="Reported revenue growth bar chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                      <XAxis dataKey="company" tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        cursor={{ fill: "rgba(0,212,200,0.04)" }}
                        contentStyle={{ background: "#07111f", border: "1px solid rgba(0,212,200,0.2)", borderRadius: 8, color: "#F8FAFC", fontSize: 12 }}
                        formatter={(value) => [`${Number(value)}%`, "Growth"]}
                      />
                      <Bar dataKey="growth" radius={[5, 5, 0, 0]}>
                        {growthData.map((entry) => <Cell key={entry.company} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  SNDK’s growth is sequential; AMZN, NVDA, and MU are year-over-year. The comparison displays the basis rather than hiding it.
                </p>
              </div>
            </div>

            <div className="mt-5 intelligence-panel p-5 sm:p-7">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.7fr)]">
                <div>
                  <div className="intelligence-kicker">Five-session trace</div>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">Relative close performance</h3>
                  <div className="mt-7 h-[320px]" aria-label="Five-session indexed performance line chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={relativePerformance} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                        <XAxis dataKey="session" tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[96, 114]} tick={{ fill: "#64748B", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                        <ReferenceLine y={100} stroke="rgba(248,250,252,0.28)" strokeDasharray="4 5" />
                        <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(0,212,200,0.2)", borderRadius: 8, color: "#F8FAFC", fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono", paddingTop: 10 }} />
                        {researchCompanies.map((company) => (
                          <Line
                            key={company.ticker}
                            type="monotone"
                            dataKey={company.ticker}
                            stroke={company.accent}
                            strokeWidth={2.4}
                            dot={false}
                            activeDot={{ r: 4 }}
                            hide={activeTicker !== "all" && activeTicker !== company.ticker}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Each series is indexed to 100 at the first of five reported sessions; this is a short-window orientation tool, not a return forecast.
                  </p>
                </div>

                <aside className="border-t border-cyan-400/10 pt-7 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                  <div className="intelligence-kicker">Interpretation guardrails</div>
                  <div className="mt-6 space-y-6">
                    {guardrails.map((item, index) => (
                      <div key={item.title} className="grid grid-cols-[26px_1fr] gap-3">
                        <span className="font-mono text-[9px] text-cyan-400">0{index + 1}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                          <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="comparison" className="scroll-mt-20 border-y border-cyan-400/10 bg-[#07111f] py-20 lg:py-24">
          <div className="container">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="intelligence-kicker mb-3">Live comparison basket</div>
                <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">Choose any four stocks.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Replace any slot with a ticker from the global live directory. Your four selections are saved in this browser.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 print:hidden">
                <div className="flex min-w-0 overflow-hidden rounded-lg border border-cyan-400/25 bg-[#050d18] shadow-[0_0_24px_rgba(0,212,200,0.05)]">
                  <button
                    type="button"
                    onClick={() => void generateComparisonBrief()}
                    disabled={summaryLoading}
                    className="btn-primary inline-flex min-h-10 items-center gap-2 rounded-none border-0 px-4 py-2.5 text-xs disabled:cursor-wait disabled:opacity-70"
                    aria-describedby="ai-summary-disclosure"
                  >
                    {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                    {summaryLoading ? `Running ${stockSummaryStyles[summaryStyle].shortLabel.toLowerCase()}…` : "Generate AI brief"}
                  </button>
                  <Select
                    value={summaryStyle}
                    onValueChange={(value) => setSummaryStyle(value as StockSummaryStyle)}
                    disabled={summaryLoading}
                  >
                    <SelectTrigger
                      size="default"
                      aria-label="Choose AI analysis style"
                      className="h-10 min-w-[132px] rounded-none border-0 border-l border-cyan-950 bg-[#050d18] px-3 font-mono text-[9px] uppercase tracking-[0.08em] text-cyan-300 shadow-none focus-visible:border-cyan-400/40 focus-visible:ring-cyan-400/20 sm:min-w-[154px]"
                    >
                      <SelectValue>{stockSummaryStyles[summaryStyle].shortLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      align="end"
                      className="w-[280px] border-cyan-400/20 bg-[#050d18] text-slate-200 shadow-[0_20px_55px_rgba(0,0,0,0.55)]"
                    >
                      {(Object.entries(stockSummaryStyles) as Array<[StockSummaryStyle, (typeof stockSummaryStyles)[StockSummaryStyle]]>).map(([value, option]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="items-start rounded-md px-3 py-3 pr-8 focus:bg-cyan-400/[0.08] focus:text-white"
                        >
                          <span className="block">
                            <span className="block text-xs font-semibold text-white">{option.label}</span>
                            <span className="mt-1 block whitespace-normal text-[10px] leading-4 text-slate-500">{option.description}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button type="button" onClick={() => void refreshComparisonStocks()} disabled={comparisonRefreshing || summaryLoading} className="intelligence-action">
                  <RefreshCw className={`h-4 w-4 ${comparisonRefreshing ? "animate-spin" : ""}`} /> Refresh prices
                </button>
                <button type="button" onClick={resetComparisonStocks} disabled={summaryLoading} className="intelligence-action">Restore defaults</button>
              </div>
            </div>

            {editingSlot !== null && (
              <StockSelectionPanel
                key={editingSlot}
                slot={editingSlot}
                selectedKeys={comparisonStocks.filter((_, index) => index !== editingSlot).map((stock) => stock.symbolKey)}
                onSelect={(stock) => replaceComparisonStock(editingSlot, stock)}
                onClose={() => setEditingSlot(null)}
              />
            )}

            <div className="grid gap-px overflow-hidden rounded-xl border border-cyan-400/10 bg-cyan-400/10 md:grid-cols-2 xl:grid-cols-4">
              {comparisonStocks.map((stock, index) => (
                <article key={`${index}-${stock.symbolKey}`} className="relative bg-[#07111f] p-6">
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: comparisonColors[index] }} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-600">Slot 0{index + 1}</span>
                      <p className="mt-2 font-mono text-[11px] tracking-[0.15em]" style={{ color: comparisonColors[index] }}>{stock.ticker}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingSlot(index)}
                      className="rounded border border-cyan-400/15 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cyan-400 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.06] print:hidden"
                      aria-label={`Change ${stock.ticker} in comparison slot ${index + 1}`}
                    >
                      Change
                    </button>
                  </div>
                  <h3 className="mt-5 truncate text-sm font-semibold text-slate-300" title={stock.name}>{stock.name}</h3>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.11em] text-slate-600">{stock.exchange} · {stock.currency}</p>
                  <p className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white">
                    {stock.price !== null ? formatMarketPrice(stock.price, stock.currency) : "—"}
                  </p>
                  <p className={`mt-3 flex items-center gap-2 font-mono text-[10px] ${stock.changePercent !== null && stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {stock.changePercent !== null ? `${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}% 1D` : "Change unavailable"}
                  </p>
                </article>
              ))}
            </div>

            {(summaryLoading || stockSummary) && (
              <div className="relative mt-6 overflow-hidden rounded-xl border border-cyan-400/20 bg-[#050d18] p-5 sm:p-7" aria-live="polite" aria-busy={summaryLoading}>
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-400">
                      {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Comparative intelligence
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white">
                      {summaryLoading
                        ? `Building the ${stockSummaryStyles[summaryStyle].label.toLowerCase()} view…`
                        : `AI-Corelogic ${stockSummaryStyles[stockSummary?.style ?? summaryStyle].shortLabel.toLowerCase()} brief`}
                    </h3>
                  </div>
                  {stockSummary && (
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.11em] ${stockSummary.mode === "ai" ? "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-400" : "border-amber-300/20 bg-amber-300/[0.06] text-amber-200"}`}>
                        {stockSummary.mode === "ai" ? "AI generated" : "Metrics fallback"}
                      </span>
                      <span className="rounded border border-white/10 bg-white/[0.025] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.11em] text-slate-400">
                        {stockSummaryStyles[stockSummary.style].shortLabel}
                      </span>
                      <button type="button" onClick={() => void copyStockSummary()} className="intelligence-action" aria-label="Copy comparative brief">
                        {summaryCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        {summaryCopied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>

                {summaryLoading ? (
                  <div className="mt-6 space-y-3" aria-label="Generating comparative analysis">
                    <div className="h-3 w-full animate-pulse rounded bg-cyan-400/10" />
                    <div className="h-3 w-[92%] animate-pulse rounded bg-cyan-400/10" />
                    <div className="h-3 w-[78%] animate-pulse rounded bg-cyan-400/10" />
                  </div>
                ) : stockSummary ? (
                  <div className="mt-6 max-w-4xl space-y-4 text-sm leading-7 text-slate-300">
                    {stockSummary.text.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    <p className="border-t border-cyan-400/10 pt-4 font-mono text-[8px] uppercase tracking-[0.1em] text-slate-600">
                      Generated {new Date(stockSummary.generatedAt).toLocaleString()} · {stockSummaryStyles[stockSummary.style].metricLabel}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span id="ai-summary-disclosure">Choose an analysis style before generating. Live market and company metrics may be delayed; AI uses only the selected basket data.</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.11em] text-cyan-400">Four slots · Global listings · Browser saved</span>
            </div>
          </div>
        </section>

        <section id="sources" className="scroll-mt-20 py-20 lg:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <div className="intelligence-panel overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSourcesOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-5 p-6 text-left sm:p-8"
                  aria-expanded={sourcesOpen}
                >
                  <div>
                    <div className="intelligence-kicker">Evidence register</div>
                    <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Trace every conclusion.</h2>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-200 ${sourcesOpen ? "rotate-180" : ""}`} />
                </button>
                {sourcesOpen && (
                  <div className="grid gap-px border-t border-cyan-400/10 bg-cyan-400/10 sm:grid-cols-2 xl:grid-cols-3">
                    {researchCompanies.map((company, index) => (
                      <a
                        key={company.ticker}
                        href={company.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[#081321] p-5 transition-colors hover:bg-[#0b1a2a]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[9px] text-cyan-400">[{index + 1}] {company.ticker}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-cyan-400" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">{company.name} {company.period} results</p>
                        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">{company.sourceDate}</p>
                      </a>
                    ))}
                    <a
                      href={yahooFinanceSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#081321] p-5 transition-colors hover:bg-[#0b1a2a]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[9px] text-cyan-400">[5] MARKET</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-cyan-400" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">Yahoo Finance chart snapshot</p>
                      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">04 Sep 2026 close</p>
                    </a>
                  </div>
                )}
              </div>

              <aside className="intelligence-panel intelligence-panel--dark p-6 sm:p-8">
                <BookOpenCheck className="h-7 w-7 text-cyan-400" />
                <h3 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-white">Research use</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Designed to make source-backed comparisons easier to revisit, circulate, and scrutinize.
                </p>
                <div className="mt-6 flex items-center gap-2 border-t border-cyan-400/10 pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-400">
                  <FileCheck2 className="h-4 w-4" /> Research only — no price targets
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-400/10 bg-[#030810] py-10">
        <div className="container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <IntelligenceMark compact />
              <span className="font-display text-sm font-bold tracking-[-0.02em] text-white">AI-Corelogic · Signal Ledger</span>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-6 text-slate-500">
              Basis: reported company figures and transparently derived ratios; time: sources and prices carry explicit dates; confidence: primary earnings releases for operating results and a public market-data snapshot for prices. This is research and analysis only, not personalized financial advice.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <Link href="/" className="intelligence-action"><ArrowLeft className="h-4 w-4" /> Main site</Link>
            <a
              href="https://wa.me/17273189265?text=Hi%20Rodney%2C%20I%27d%20like%20to%20discuss%20AI-Corelogic%20Financial%20Stock%20Analysis."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs"
            >
              <MessageCircle className="h-4 w-4" /> Discuss the research
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
