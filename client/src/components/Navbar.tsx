/**
 * AI-CoreLogic global navigation — primary routes plus a compact training library.
 */

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, FileText, Menu, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { trainingCourses } from "@/lib/trainingCourses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "AI Blueprint", href: "/blueprint" },
  { label: "Industries", href: "/blueprint#industries" },
  { label: "AI Strategy", href: "/category/ai-strategy" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
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

  const renderNavLinks = (mobile = false, links = navLinks) => links.map((link) => (
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

  const desktopTrainingMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1.5 text-sm font-medium tracking-wide text-slate-300 transition-colors hover:text-cyan-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 data-[state=open]:text-cyan-300"
          style={{ fontFamily: "var(--font-body)" }}
        >
          AI Training
          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={14} className="w-[360px] rounded-xl border-cyan-400/20 bg-[#07111f] p-2 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <DropdownMenuLabel className="px-3 py-3">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-400">AI Training / Course Library</span>
          <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">Technical guides and training materials</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-cyan-400/10" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 text-cyan-200 focus:bg-cyan-400/[0.08] focus:text-white">
          <a href="/training" className="flex w-full items-center gap-3 px-3 py-3 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            <span>Course overview &amp; prerequisites</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-cyan-400/10" />
        {trainingCourses.map((course, index) => (
          <DropdownMenuItem key={course.href} asChild className="cursor-pointer rounded-lg p-0 text-slate-200 focus:bg-cyan-400/[0.08] focus:text-white">
            <a href={course.href} className="flex w-full items-start gap-3 px-3 py-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-5">{course.title}</span>
                <span className="mt-1 block text-[11px] font-normal leading-4 text-slate-500">{course.subtitle}</span>
              </span>
              <span className="font-mono text-[9px] tracking-wider text-cyan-500">{String(index + 1).padStart(2, "0")}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

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

          <div className="hidden items-center gap-4 xl:gap-5 lg:flex">
            {renderNavLinks(false, navLinks.slice(0, 1))}
            {desktopTrainingMenu}
            {renderNavLinks(false, navLinks.slice(1))}
          </div>

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
            {renderNavLinks(true, navLinks.slice(0, 1))}
            <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025]">
              <button
                type="button"
                onClick={() => setTrainingOpen((open) => !open)}
                className="flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                aria-expanded={trainingOpen}
                aria-controls="mobile-training-courses"
              >
                AI Training
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${trainingOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {trainingOpen && (
                <div id="mobile-training-courses" className="border-t border-cyan-400/10 p-2">
                  <a
                    href="/training"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                  >
                    <BookOpen className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                    Course overview &amp; prerequisites
                  </a>
                  {trainingCourses.map((course, index) => (
                    <a
                      key={course.href}
                      href={course.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-start gap-3 rounded-lg px-3 py-3 text-slate-200 transition-colors hover:bg-cyan-400/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-5">{course.title}</span>
                        <span className="mt-1 block text-[11px] leading-4 text-slate-500">{course.subtitle}</span>
                      </span>
                      <span className="font-mono text-[9px] text-cyan-500">{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            {renderNavLinks(true, navLinks.slice(1))}
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
