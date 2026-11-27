/**
 * AI-CoreLogic global navigation — reduced to the main visitor routes.
 */

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const navLinks = [
  { label: "AI Blueprint", href: "/blueprint" },
  { label: "Capabilities", href: "/blueprint#capabilities" },
  { label: "Industries", href: "/blueprint#industries" },
  { label: "AI Strategy", href: "/category/ai-strategy" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { trackSchedulingClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (href: string) => {
    setMobileOpen(false);
    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin) return;

    const destination = `${target.pathname}${target.search}${target.hash}`;
    if (target.pathname !== window.location.pathname) {
      window.location.assign(destination);
      return;
    }

    if (!target.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", destination);
      return;
    }

    const element = document.getElementById(target.hash.slice(1));
    if (!element) {
      window.location.assign(destination);
      return;
    }
    window.history.replaceState(null, "", destination);
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  };

  const renderNavLinks = (mobile = false) => navLinks.map((link) => (
    <a
      key={link.href}
      href={link.href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(link.href);
      }}
      className={mobile
        ? "rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-cyan-400/5 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        : "text-sm font-medium tracking-wide text-slate-300 transition-colors duration-200 hover:text-cyan-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {link.label}
    </a>
  ));

  return (
    <nav className={`nav-frame fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur" : "bg-transparent"}`} aria-label="Main navigation">
      <div className="container">
        <div className="nav-command-bar flex h-16 items-center justify-between lg:h-20">
          <a href="/" className="group flex items-center gap-3" aria-label="AI-CoreLogic home">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/logo_8ad417ef.png"
              alt="AI-CoreLogic"
              className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90 lg:h-12"
            />
            <span className="hidden flex-col border-l border-cyan-400/20 pl-3 leading-none 2xl:flex">
              <span className="nav-system-label">AI OPERATING ARCHITECTURE</span>
              <span className="nav-system-status"><i /> SYSTEMS ONLINE</span>
            </span>
          </a>

          <div className="hidden items-center gap-4 xl:gap-6 lg:flex">{renderNavLinks()}</div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://calendar.google.com/calendar/u/0?cid=rodchiasson@ai-corelogic.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSchedulingClick("call")}
              className="nav-briefing-link text-xs font-medium text-slate-300 transition-colors duration-200 hover:text-cyan-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              00 / BOOK BRIEFING
            </a>
            <a href="/#contact" className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">Start Assessment</a>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 transition-colors hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="nav-blur max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-cyan-400/10 lg:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {renderNavLinks(true)}
            <div className="mt-2 flex flex-col gap-2 border-t border-cyan-400/10 pt-3">
              <a
                href="https://calendar.google.com/calendar/u/0?cid=rodchiasson@ai-corelogic.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setMobileOpen(false); trackSchedulingClick("call"); }}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-cyan-400/5 hover:text-cyan-300"
              >Book a strategy briefing</a>
              <a href="/#contact" onClick={(event) => { event.preventDefault(); navigate("/#contact"); }} className="btn-primary rounded-lg px-5 py-3 text-center text-sm font-semibold">Start Assessment</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
