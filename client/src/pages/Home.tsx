/*
 * AI-CoreLogic Home — a short orientation path into the full operating blueprint.
 * Theme: Deep Intelligence / aerospace HMI.
 */

import { ArrowDownRight, ArrowRight, Boxes, Compass, Workflow } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const entryPoints = [
  {
    number: "01",
    title: "Find the right work",
    detail: "AI discovery, readiness, and opportunity selection.",
    href: "/blueprint#capabilities",
    icon: Compass,
  },
  {
    number: "02",
    title: "Make it operational",
    detail: "A practical path from architecture to adoption.",
    href: "/blueprint#process",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Fit your sector",
    detail: "Use cases shaped around real industry workflows.",
    href: "/blueprint#industries",
    icon: Boxes,
  },
];

export default function Home() {
  return (
    <div className="site-shell min-h-screen" style={{ background: "#050B18" }}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="hmi-flow">
        <HeroSection />
        <StatsSection />

        <section id="about" aria-labelledby="orientation-title" className="relative overflow-hidden py-24 sm:py-32">
          <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }} />
          <div className="container relative z-10">
            <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="mono-label mb-4">A clearer starting point / 01</p>
                <h2 id="orientation-title" className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                  AI should work in the <span className="gradient-text">real business.</span>
                </h2>
              </div>
              <div className="max-w-2xl border-l border-cyan-400/20 pl-6 sm:pl-8">
                <p className="text-lg leading-8 text-slate-300">
                  The hard part is not finding another model. It is finding the right problem, fitting the solution to your systems, and bringing people with you.
                </p>
                <p className="mt-4 leading-7 text-slate-400">
                  AI-CoreLogic helps small and mid-sized organizations turn AI ambition into a practical operating advantage—from the first opportunity assessment through implementation, governance, and ongoing improvement.
                </p>
                <a href="/blueprint" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-all duration-200 hover:gap-3 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                  Explore the AI Blueprint <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="route-title" className="relative border-y border-cyan-400/10 bg-[#081322] py-20 sm:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mono-label mb-3">Choose your next coordinate</p>
                <h2 id="route-title" className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                  A clear route from question to capability.
                </h2>
              </div>
              <a href="/blueprint" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                View the full blueprint <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {entryPoints.map(({ number, title, detail, href, icon: Icon }) => (
                <a key={number} href={href} className="group relative min-h-48 overflow-hidden rounded-2xl border border-slate-700/70 bg-[#0B192B] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_18px_50px_rgba(0,212,200,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.18em] text-cyan-400">{number} / ROUTE</span>
                    <Icon className="h-5 w-5 text-slate-500 transition-colors group-hover:text-cyan-300" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{detail}</p>
                  <ArrowDownRight className="absolute bottom-6 right-6 h-4 w-4 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-cyan-300" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 sm:py-24" aria-labelledby="closing-title">
          <div className="container">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-[#102338] via-[#0B192B] to-[#07111F] p-8 sm:p-12 lg:p-16">
              <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 68%)" }} />
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="mono-label mb-4">Start with the business, not the hype</p>
                  <h2 id="closing-title" className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                    One thoughtful first step can change the whole roadmap.
                  </h2>
                  <p className="mt-5 max-w-xl leading-7 text-slate-300">Tell us where you are today. We’ll help you identify a sensible place to begin.</p>
                </div>
                <a href="/#contact" className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold">
                  Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
