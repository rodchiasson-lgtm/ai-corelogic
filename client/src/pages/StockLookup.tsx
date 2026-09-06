import { useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  ExternalLink,
  FileText,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { popularStocks } from "@/lib/stockDirectory";
import { researchCompanies } from "@/lib/intelligenceData";

export default function StockLookup() {
  const [, params] = useRoute("/stocks/:ticker");
  const ticker = (params?.ticker || "").toUpperCase();
  const directoryEntry = useMemo(
    () => popularStocks.find((company) => company.ticker === ticker),
    [ticker]
  );
  const coveredCompany = useMemo(
    () => researchCompanies.find((company) => company.ticker === ticker),
    [ticker]
  );

  useEffect(() => {
    document.title = `${ticker || "Stock"} Lookup | AI-Corelogic`;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [ticker]);

  const displayName = directoryEntry?.name || coveredCompany?.name || ticker;
  const exchange = directoryEntry?.exchange || "Market ticker";
  const sector = directoryEntry?.sector || coveredCompany?.thesis || "Public market security";
  const yahooUrl = `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}`;
  const secUrl = `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(ticker)}`;
  const analysisUrl = coveredCompany
    ? `/intelligence?ticker=${encodeURIComponent(ticker)}#evidence`
    : "/intelligence";

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#030810]/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to AI-Corelogic homepage">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/logo_8ad417ef.png"
              alt="AI-Corelogic"
              className="h-9 w-auto object-contain lg:h-11"
            />
            <span className="hidden border-l border-cyan-400/20 pl-3 sm:block">
              <span className="block font-mono text-[9px] tracking-[0.16em] text-slate-400">FINANCIAL STOCK ANALYSIS</span>
              <span className="mt-1 block font-mono text-[8px] tracking-[0.14em] text-cyan-400">TICKER LOOKUP / {ticker}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="intelligence-action hidden sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> Main site
            </Link>
            <Link href="/intelligence" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs">
              Research desk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-cyan-400/10 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(0,212,200,0.12),transparent_26rem),linear-gradient(rgba(0,212,200,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,200,0.025)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="container relative z-10">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">
                <span className="text-cyan-400">Ticker lookup</span>
                <span className="h-3 w-px bg-slate-700" />
                <span>{exchange}</span>
                <span className="h-3 w-px bg-slate-700" />
                <span>{sector}</span>
              </div>

              <div className="mt-8 flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] font-mono text-sm font-bold tracking-[0.1em] text-cyan-400 sm:h-20 sm:w-20 sm:text-base">
                  {ticker.slice(0, 5)}
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">{displayName}</h1>
                  <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-cyan-400">{ticker}</p>
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-base leading-8 text-slate-400">
                {coveredCompany
                  ? "This company has a full source-forward evidence file in the AI-Corelogic research desk."
                  : "This ticker is available through the expanded stock directory. Open its current public quote or regulatory filings, or request a full AI-Corelogic research brief."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={yahooUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm">
                  View current quote <ExternalLink className="h-4 w-4" />
                </a>
                {coveredCompany && (
                  <Link href={analysisUrl} className="intelligence-action">
                    Open full analysis <BarChart3 className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="mb-8">
              <div className="intelligence-kicker">Research routes</div>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Continue the {ticker} investigation</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <a href={yahooUrl} target="_blank" rel="noopener noreferrer" className="intelligence-panel group p-6 transition-transform duration-200 hover:-translate-y-1">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
                <h3 className="mt-5 text-lg font-bold text-white">Quote and chart</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Review current pricing, recent performance, volume, and public market news.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-400">Open market data <ExternalLink className="h-3.5 w-3.5" /></span>
              </a>

              <a href={secUrl} target="_blank" rel="noopener noreferrer" className="intelligence-panel group p-6 transition-transform duration-200 hover:-translate-y-1">
                <FileText className="h-6 w-6 text-cyan-400" />
                <h3 className="mt-5 text-lg font-bold text-white">SEC filings</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Search official filings for earnings, risk factors, material events, and disclosures.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-400">Search EDGAR <ExternalLink className="h-3.5 w-3.5" /></span>
              </a>

              <a
                href={`https://wa.me/17273189265?text=${encodeURIComponent(`Hi Rodney, I'd like a full AI-Corelogic research brief for ${ticker} (${displayName}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="intelligence-panel group p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <MessageCircle className="h-6 w-6 text-cyan-400" />
                <h3 className="mt-5 text-lg font-bold text-white">Request full analysis</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Commission a source-forward brief using the same evidence protocol as Signal Ledger.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-400">Start a request <ArrowRight className="h-3.5 w-3.5" /></span>
              </a>
            </div>

            <div className="mt-8 grid gap-5 border border-cyan-400/10 bg-[#07111f] p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Coverage distinction</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    SNDK, AMZN, NVDA, and MU currently include complete AI-Corelogic evidence files. Other directory results provide reliable routes to public quote and filing sources without presenting unverified analysis as in-house research.
                  </p>
                </div>
              </div>
              <Link href="/intelligence" className="intelligence-action whitespace-nowrap">
                <Search className="h-4 w-4" /> Browse covered research
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-400/10 bg-[#030810] py-8">
        <div className="container flex flex-col gap-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-cyan-400" /> AI-Corelogic Financial Stock Analysis</span>
          <span>External quote data remains subject to the source provider’s timing and terms.</span>
        </div>
      </footer>
    </div>
  );
}
