/**
 * AI-CoreLogic Navbar
 * Theme: Deep Intelligence — dark aerospace, cyan accents
 * Behavior: Transparent on top, blurred on scroll
 */

import { useState, useEffect } from "react";
import { Activity, BarChart3, BookOpenCheck, ChevronDown, FileSearch, Menu, Search, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { researchCompanies, type ResearchCompany } from "@/lib/intelligenceData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

const financialAnalysisLinks = [
  { label: "Research Desk", description: "Complete comparative briefing", href: "/intelligence", icon: BarChart3 },
  { label: "Company Evidence", description: "Source-backed company files", href: "/intelligence#evidence", icon: FileSearch },
  { label: "Market Signals", description: "Revenue, growth and price traces", href: "/intelligence#signals", icon: Activity },
  { label: "Evidence Sources", description: "Primary releases and market data", href: "/intelligence#sources", icon: BookOpenCheck },
];

function TickerSearch({
  query,
  onQueryChange,
  onSelect,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (ticker: ResearchCompany["ticker"]) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = normalizedQuery
    ? researchCompanies.filter(
        (company) =>
          company.ticker.toLowerCase().includes(normalizedQuery) ||
          company.name.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <div
      className="px-2 pb-2"
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter" && matches[0]) {
          event.preventDefault();
          onSelect(matches[0].ticker);
        }
      }}
    >
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          placeholder="Search ticker or company..."
          aria-label="Search stock ticker or company"
          autoComplete="off"
          className="h-10 w-full rounded-lg border border-cyan-400/15 bg-[#030810]/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/45 focus:outline-none"
        />
      </label>

      {normalizedQuery ? (
        <div className="mt-2 space-y-1" role="listbox" aria-label="Matching stocks">
          {matches.length > 0 ? (
            matches.map((company) => (
              <button
                type="button"
                key={company.ticker}
                onClick={() => onSelect(company.ticker)}
                className="flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-cyan-400/15 hover:bg-cyan-400/[0.06] focus-visible:border-cyan-400/30 focus-visible:outline-none"
                role="option"
              >
                <span className="flex items-center gap-3">
                  <i className="h-2 w-2 rounded-full" style={{ background: company.accent, boxShadow: `0 0 8px ${company.accent}80` }} />
                  <span>
                    <span className="block font-mono text-[10px] tracking-[0.12em] text-white">{company.ticker}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-500">{company.name}</span>
                  </span>
                </span>
                <span className="font-mono text-[9px] text-cyan-400">VIEW</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-xs text-slate-500">No covered ticker found.</p>
          )}
        </div>
      ) : (
        <p className="px-1 pt-2 font-mono text-[8px] uppercase tracking-[0.11em] text-slate-600">
          Try SNDK, AMZN, NVDA or MU
        </p>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [financialOpen, setFinancialOpen] = useState(false);
  const [tickerQuery, setTickerQuery] = useState("");
  const { trackSchedulingClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setFinancialOpen(false);
    setTickerQuery("");
    if (href.startsWith("/")) {
      // Internal routed experience
      window.location.href = href;
    } else {
      // Anchor link
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleTickerSelect = (ticker: ResearchCompany["ticker"]) => {
    handleNavClick(`/intelligence?ticker=${encodeURIComponent(ticker)}#evidence`);
  };

  return (
    <nav
      className={`nav-frame fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="nav-command-bar flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/logo_8ad417ef.png"
              alt="AI-CoreLogic"
              className="h-10 lg:h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
            <span className="hidden 2xl:flex flex-col border-l border-cyan-400/20 pl-3 leading-none">
              <span className="nav-system-label">AI OPERATING ARCHITECTURE</span>
              <span className="nav-system-status"><i /> SYSTEMS ONLINE</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.slice(0, 3).map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}

            <DropdownMenu onOpenChange={(open) => { if (!open) setTickerQuery(""); }}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 data-[state=open]:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Financial Stock Analysis
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={14}
                className="w-[320px] rounded-xl border-cyan-400/20 bg-[#07111f]/98 p-2 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              >
                <DropdownMenuLabel className="px-3 py-3">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-400">Financial Stock Analysis</span>
                  <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">Source-forward company research and comparative market signals.</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-400/10" />
                <TickerSearch query={tickerQuery} onQueryChange={setTickerQuery} onSelect={handleTickerSelect} />
                <DropdownMenuSeparator className="bg-cyan-400/10" />
                {financialAnalysisLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onSelect={() => handleNavClick(item.href)}
                      className="group cursor-pointer gap-3 rounded-lg px-3 py-3 text-slate-300 focus:bg-cyan-400/[0.08] focus:text-white"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="mt-0.5 block text-[11px] font-normal text-slate-500 group-focus:text-slate-400">{item.description}</span>
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(3).map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://calendar.google.com/calendar/u/0?cid=rodchiasson@ai-corelogic.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSchedulingClick('call')}
              className="nav-briefing-link text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-xs font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              00 / BOOK BRIEFING
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Start Assessment
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden nav-blur border-t border-cyan-400/10">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.slice(0, 3).map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}

            <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025]">
              <button
                type="button"
                onClick={() => setFinancialOpen((open) => !open)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                style={{ fontFamily: "var(--font-body)" }}
                aria-expanded={financialOpen}
              >
                Financial Stock Analysis
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${financialOpen ? "rotate-180" : ""}`} />
              </button>
              {financialOpen && (
                <div className="border-t border-cyan-400/10 p-2">
                  <TickerSearch query={tickerQuery} onQueryChange={setTickerQuery} onSelect={handleTickerSelect} />
                  <div className="my-2 h-px bg-cyan-400/10" />
                  {financialAnalysisLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-400 transition-colors hover:bg-cyan-400/[0.06] hover:text-white"
                      >
                        <Icon className="h-4 w-4 text-cyan-400" />
                        <span>
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] text-slate-600">{item.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {navLinks.slice(3).map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-cyan-400/10 flex flex-col gap-2">
              <a
                href="https://calendar.google.com/calendar/u/0?cid=rodchiasson@ai-corelogic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-left px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book Strategy Briefing
              </a>
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-primary w-full px-5 py-3 rounded-lg text-sm font-semibold"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
