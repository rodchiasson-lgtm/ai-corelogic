import { useEffect } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, Database, Download, Network, Workflow } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trainingCourses } from "@/lib/trainingCourses";

const architectureIcons = [Database, Workflow, Network];

export default function Training() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "AI Training Courses | AI-CoreLogic";
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") ?? null;
    description?.setAttribute(
      "content",
      "Explore AI-CoreLogic training guides for agentic AI, model training, RAG, MCP integrations, inference architecture, and production operations.",
    );
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <div className="site-shell min-h-screen" style={{ background: "#050B18" }}>
      <a className="skip-link" href="#training-main">Skip to content</a>
      <Navbar />
      <main id="training-main" className="hmi-flow">
        <section className="relative overflow-hidden border-b border-cyan-400/10 pb-14 pt-32 sm:pb-20 sm:pt-40">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 78% 36%, rgba(0,212,200,.13), transparent 38%), radial-gradient(ellipse at 8% 80%, rgba(37,99,235,.12), transparent 42%)",
            }}
          />
          <div className="container relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                  <span className="pulse-dot inline-block" /> AI TRAINING / PRACTICAL SYSTEMS
                </div>
                <h1
                  className="text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Build the systems behind <span className="gradient-text">AI that learns and acts.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  Architecture guides for people designing practical AI platforms—from the data and agent foundation to model training, production inference, and the feedback loops that keep systems improving.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#agentic-training" className="btn-primary inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">
                    Explore course 01 <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a href="#prerequisites" className="btn-outline-glow inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">
                    Check prerequisites <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <aside className="relative rounded-2xl border border-cyan-300/15 bg-[#07111F]/85 p-6 shadow-[0_28px_90px_rgba(0,0,0,.35)] backdrop-blur sm:p-8" aria-label="Training library summary">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-cyan-300/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300">Course library</span>
                </div>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Current offering / 01</p>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Agentic Training &amp; Inference Platform
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  A step-by-step architecture guide spanning the foundation, model-training workflow, and live agent inference.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Format</span>
                    <span className="mt-1 block text-sm text-slate-300">DOCX guide</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Length</span>
                    <span className="mt-1 block text-sm text-slate-300">14 pages</span>
                  </div>
                </div>
                <a href="#agentic-training" className="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-cyan-300/15 px-4 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                  View course details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-[#07111F]/65 py-12 sm:py-16" aria-labelledby="training-approach">
          <div className="container">
            <div className="max-w-2xl">
              <p className="mono-label mb-3">The learning path / One system, three connected layers</p>
              <h2 id="training-approach" className="text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                From platform foundations to a live feedback loop.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {trainingCourses[0].architectures.map((stage, index) => {
                const Icon = architectureIcons[index] ?? Network;
                return (
                  <article key={stage.name} className="rounded-xl border border-white/[0.08] bg-[#050B18]/75 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-400">{stage.name}</span>
                      <Icon className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">{stage.description}</p>
                    <ul className="mt-5 space-y-3 border-t border-white/[0.07] pt-4">
                      {stage.details.map((detail) => (
                        <li key={detail} className="flex gap-2.5 text-xs leading-5 text-slate-400">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {trainingCourses.map((course, courseIndex) => (
          <section key={course.id} id={course.id} className="scroll-mt-24 border-b border-cyan-400/10 py-14 sm:py-20" aria-labelledby={`${course.id}-title`}>
            <div className="container">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
                <div>
                  <p className="mono-label mb-4">Course {String(courseIndex + 1).padStart(2, "0")} / Detailed overview</p>
                  <h2 id={`${course.id}-title`} className="text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                    {course.title}
                  </h2>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">{course.subtitle}</p>
                  <p className="mt-7 max-w-3xl text-base leading-7 text-slate-300">{course.summary}</p>
                  <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-400">{course.audience}</p>

                  <div className="mt-9 rounded-xl border border-white/[0.08] bg-[#07111F]/70 p-5 sm:p-6">
                    <h3 className="text-lg font-semibold text-white">What you’ll be able to trace</h3>
                    <ul className="mt-5 space-y-3.5">
                      {course.outcomes.map((outcome) => (
                        <li key={outcome} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={course.documentHref}
                    download={course.downloadName}
                    className="btn-primary mt-7 inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" /> Download the architecture guide
                  </a>
                  <p className="mt-3 text-xs leading-5 text-slate-500">Opens the attached 14-page DOCX resource.</p>
                </div>

                <aside id="prerequisites" className="scroll-mt-24 space-y-5">
                  <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.035] p-5 sm:p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan-300">Recommended background</div>
                    <h3 className="mt-3 text-xl font-semibold text-white">A technical foundation helps.</h3>
                    <ul className="mt-5 space-y-4">
                      {course.recommendedPrerequisites.map((requirement) => (
                        <li key={requirement} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-cyan-300/10 pt-4 text-xs leading-5 text-slate-500">
                      The source guide does not state formal enrollment prerequisites. These are recommendations based on the cloud, ML, data, and agent-integration topics it covers; no coding exercise or cloud account is required just to read the document.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#07111F]/70 p-5 sm:p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-slate-500">Resource details</div>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4"><dt className="text-slate-500">Learning format</dt><dd className="text-right text-slate-300">{course.format}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-500">Document</dt><dd className="text-right text-slate-300">DOCX · 14 pages</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-500">Core stack</dt><dd className="max-w-[65%] text-right text-slate-300">Google Cloud, Oracle AI Database, LangGraph, n8n, MCP</dd></div>
                    </dl>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ))}

        <section className="bg-[#07111F] py-14 sm:py-16">
          <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label mb-3">Continue learning / Build your course library</p>
              <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                More practical AI training can live here as it becomes available.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Course listings will expand as additional training materials are added.</p>
            </div>
            <a href="/#contact" className="btn-outline-glow inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold">
              Talk about training needs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
