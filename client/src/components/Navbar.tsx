/**
 * AI-CoreLogic Navbar
 * Theme: Deep Intelligence — dark aerospace, cyan accents
 * Behavior: Transparent on top, blurred on scroll
 */

import { useState, useEffect } from "react";
import { Beaker, ChevronDown, DollarSign, HeartPulse, Menu, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
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

const industryLinks = [
  { label: "Financial Services", href: "#financial-services-models", icon: DollarSign, description: "Financial AI expertise and Hugging Face models" },
  { label: "Healthcare", href: "#industry-healthcare", icon: HeartPulse, description: "Clinical workflows and patient insights" },
  { label: "Life Sciences", href: "#industry-life-sciences", icon: Beaker, description: "Drug discovery and clinical research" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [desktopIndustriesOpen, setDesktopIndustriesOpen] = useState(false);
  const { trackSchedulingClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Support bookmarked or shared links to the industry section and its cards.
    const hash = window.location.hash;
    if (hash === "#industries" || hash === "#industry-financial-services" || industryLinks.some((link) => link.href === hash)) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" });
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setIndustriesOpen(false);
    setDesktopIndustriesOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else {
      const el = document.getElementById(href.slice(1));
      if (el) {
        window.history.replaceState(null, "", href);
        window.requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        });
      }
    }
  };

  const renderNavLinks = (links: typeof navLinks, mobile = false) => links.map((link) => (
    <button
      key={link.href}
      onClick={() => handleNavClick(link.href)}
      className={mobile
        ? "text-left px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200 text-sm font-medium"
        : "text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {link.label}
    </button>
  ));

  return (
    <nav
      className={`nav-frame fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-blur" : "bg-transparent"}`}
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="nav-command-bar flex items-center justify-between h-16 lg:h-20">
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

          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {renderNavLinks(navLinks.slice(0, 3))}
            <DropdownMenu open={desktopIndustriesOpen} onOpenChange={setDesktopIndustriesOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 data-[state=open]:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Industries
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={14}
                className="w-[300px] rounded-xl border-cyan-400/20 bg-[#07111f] p-2 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
              >
                <DropdownMenuLabel className="px-3 py-3">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-400">Industries</span>
                  <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">AI expertise tailored to your sector.</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-400/10" />
                {industryLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild className="cursor-pointer gap-3 rounded-lg px-3 py-3 text-slate-300 focus:bg-cyan-400/[0.08] focus:text-white">
                      <a href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-400">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] font-normal text-slate-500">{item.description}</span>
                        </span>
                      </a>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {renderNavLinks(navLinks.slice(3))}
          </div>

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
            <button onClick={() => handleNavClick("#contact")} className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold">
              Start Assessment
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            onClick={() => { setMobileOpen(!mobileOpen); setIndustriesOpen(false); }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="lg:hidden nav-blur border-t border-cyan-400/10 max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="container py-4 flex flex-col gap-1">
            {renderNavLinks(navLinks.slice(0, 3), true)}
            <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025]">
              <button
                type="button"
                onClick={() => setIndustriesOpen((open) => !open)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                style={{ fontFamily: "var(--font-body)" }}
                aria-expanded={industriesOpen}
                aria-controls="mobile-industries"
              >
                Industries
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${industriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {industriesOpen && (
                <div id="mobile-industries" className="border-t border-cyan-400/10 p-2">
                  {industryLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-400 transition-colors hover:bg-cyan-400/[0.06] hover:text-white"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] text-slate-500">{item.description}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            {renderNavLinks(navLinks.slice(3), true)}
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
              <button onClick={() => handleNavClick("#contact")} className="btn-primary w-full px-5 py-3 rounded-lg text-sm font-semibold">
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
