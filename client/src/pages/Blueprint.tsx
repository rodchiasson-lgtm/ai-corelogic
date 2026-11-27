import { useEffect } from "react";
import { ArrowDown, ArrowRight, Compass, Layers3, RadioTower, ScanSearch } from "lucide-react";
import Navbar from "@/components/Navbar";
import BrandVideoSection from "@/components/BrandVideoSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import IndustriesSection from "@/components/IndustriesSection";
import ResearchSection from "@/components/ResearchSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const chapters = [
  { id: "capabilities", num: "01", label: "Capabilities", icon: ScanSearch },
  { id: "process", num: "02", label: "Delivery system", icon: Layers3 },
  { id: "industries", num: "03", label: "Sector applications", icon: Compass },
  { id: "research", num: "04", label: "Research signals", icon: RadioTower },
];

function BlueprintIllustration() {
  return (
    <div className="blueprint-visual relative mx-auto aspect-square w-full max-w-[25rem]" aria-label="Diagram showing diagnose, architect, and operationalize as a connected system" role="img">
      <div className="absolute inset-[8%] rounded-full border border-cyan-300/10" />
      <div className="absolute inset-[20%] rounded-full border border-cyan-300/10" />
      <div className="absolute inset-[32%] rounded-full border border-cyan-300/15" />
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 52% 47%, rgba(0,212,200,.12), transparent 60%)" }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <path d="M200 52V112L248 160H334" stroke="rgba(0,212,200,.48)" strokeWidth="1" />
        <path d="M66 236H144L200 180" stroke="rgba(37,99,235,.58)" strokeWidth="1" />
        <path d="M200 210V284L253 337" stroke="rgba(0,212,200,.35)" strokeWidth="1" />
        <circle cx="200" cy="52" r="3" fill="#00D4C8" />
        <circle cx="334" cy="160" r="3" fill="#00D4C8" />
        <circle cx="66" cy="236" r="3" fill="#2563EB" />
        <circle cx="253" cy="337" r="3" fill="#00D4C8" />
        <path d="M140 96L200 62L260 96V164L200 198L140 164V96Z" stroke="rgba(248,250,252,.3)" strokeWidth="1" />
        <path d="M200 62V198M140 96L260 164M260 96L140 164" stroke="rgba(0,212,200,.17)" strokeWidth="1" />
      </svg>
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-300/30 bg-[#081522]/90 text-center shadow-[0_0_55px_rgba(0,212,200,.13)] backdrop-blur">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300">AI / ACL</span>
        <span className="mt-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>Operating<br />system</span>
      </div>
      <span className="absolute left-[2%] top-[55%] font-mono text-[9px] tracking-[0.14em] text-blue-300">01 / DIAGNOSE</span>
      <span className="absolute right-[0%] top-[36%] font-mono text-[9px] tracking-[0.14em] text-cyan-200">02 / ARCHITECT</span>
      <span className="absolute bottom-[5%] right-[10%] font-mono text-[9px] tracking-[0.14em] text-slate-400">03 / OPERATIONALIZE</span>
      <span className="absolute right-[6%] top-[5%] font-mono text-[8px] tracking-[0.18em] text-slate-600">FIG. 01 / SYSTEM MAP</span>
    </div>
  );
}

export default function Blueprint() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "The AI Blueprint | AI-CoreLogic";
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") ?? null;
    description?.setAttribute("content", "Explore the AI-CoreLogic operating blueprint: AI discovery, implementation, delivery, sector applications, and applied research.");
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) description.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <div className="site-shell min-h-screen" style={{ background: "#050B18" }}>
      <a className="skip-link" href="#blueprint-main">Skip to content</a>
      <Navbar />
      <main id="blueprint-main" className="hmi-flow">
        <section id="blueprint-top" className="relative overflow-hidden border-b border-cyan-400/10 pb-14 pt-32 sm:pb-20 sm:pt-40">
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 76% 48%, rgba(0,212,200,.09), transparent 42%), linear-gradient(135deg, rgba(37,99,235,.04), transparent 60%)" }} />
          <div className="container relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                  <span className="pulse-dot inline-block" /> FIELD GUIDE / AI OPERATING BLUEPRINT
                </div>
                <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
                  Build AI into the way <span className="gradient-text">work gets done.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  A structured view of what we do, how we deliver, and where practical AI can change the operating picture—without turning the whole site into one long briefing.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#capabilities" className="btn-primary inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">Explore capabilities <ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
                  <a href="/#contact" className="btn-outline-glow inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">Talk through a challenge <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                </div>
              </div>
              <BlueprintIllustration />
            </div>
          </div>
        </section>

        <BrandVideoSection />

        <nav className="border-b border-white/[0.06] bg-[#07111F]/90" aria-label="Blueprint sections">
          <div className="container flex flex-wrap items-center gap-x-7 gap-y-1 py-4">
            <span className="mr-1 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600 sm:inline">Jump to</span>
            {chapters.map(({ id, num, label }) => (
              <a key={id} href={`#${id}`} className="group inline-flex min-h-10 items-center gap-2 text-xs text-slate-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                <span className="font-mono text-[9px] text-cyan-500/80">{num}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div id="capabilities" className="scroll-mt-20">
          <ServicesSection />
        </div>
        <div className="scroll-mt-20"><ProcessSection /></div>
        <div className="scroll-mt-20"><IndustriesSection /></div>
        <div className="scroll-mt-20"><ResearchSection /></div>

        <section aria-labelledby="blueprint-close" className="border-t border-cyan-400/10 bg-[#07111F] py-16 sm:py-20">
          <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label mb-3">Next step / A real conversation</p>
              <h2 id="blueprint-close" className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Start with one workflow worth improving.</h2>
            </div>
            <a href="/#contact" className="btn-primary inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold">Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
