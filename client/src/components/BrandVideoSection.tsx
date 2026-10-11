import { useState } from "react";
import { ArrowRight, Captions, Film } from "lucide-react";

export const BRAND_VIDEO_ASSETS = {
  video: "/media/ai-corelogic-brand-30s-v1.mp4",
  poster: "/media/ai-corelogic-brand-30s-v1.jpg",
  captions: "/media/ai-corelogic-brand-30s-v1.en.vtt",
} as const;

export const BRAND_VIDEO_TRANSCRIPT =
  "Turn AI ambition into operating advantage. AI-CoreLogic helps businesses discover where AI can create value, design the right architecture, and bring it into everyday operations. From financial services to healthcare and life sciences, we connect strategy, implementation, and responsible governance. Diagnose. Architect. Operationalize. Built for real business. Visit AI-CoreLogic dot com and request your AI readiness briefing.";

export default function BrandVideoSection() {
  const [playbackError, setPlaybackError] = useState(false);

  return (
    <section
      id="brand-video"
      aria-labelledby="brand-video-heading"
      className="relative scroll-mt-28 border-y border-cyan-400/10 bg-[#07111f] py-14 lg:py-20"
    >
      <div className="container flex flex-col gap-9 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 lg:w-[32%] lg:shrink-0">
          <div className="mono-label mb-4 flex items-center gap-2">
            <Film className="h-4 w-4" aria-hidden="true" />
            30-second mission briefing
          </div>
          <h2
            id="brand-video-heading"
            className="text-3xl font-bold leading-tight text-white lg:text-4xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            See AI ambition become <span className="gradient-text">operating advantage.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400">
            Diagnose. Architect. Operationalize. A quick introduction to practical AI
            transformation, built around your business.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
          >
            Request your AI readiness briefing
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p id="brand-video-description" className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <Captions className="h-4 w-4 shrink-0" aria-hidden="true" />
            English voiceover and music. Captions available. Press play to watch.
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-[#050B18] shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
            <video
              controls
              playsInline
              preload="metadata"
              poster={BRAND_VIDEO_ASSETS.poster}
              aria-label="AI-CoreLogic: Turn AI ambition into operating advantage"
              aria-describedby="brand-video-description"
              className="block aspect-video h-auto w-full"
              onError={() => setPlaybackError(true)}
              onLoadedData={() => setPlaybackError(false)}
            >
              <source src={BRAND_VIDEO_ASSETS.video} type="video/mp4" />
              <track
                kind="captions"
                src={BRAND_VIDEO_ASSETS.captions}
                srcLang="en"
                label="English"
              />
              Your browser does not support embedded video. Use the download link below.
            </video>
          </div>
          {playbackError && (
            <p role="status" className="mt-3 text-sm text-amber-300">
              The video could not be loaded. Try refreshing or download it below.
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3 text-xs text-slate-400">
            <details className="min-w-0 flex-1">
              <summary className="w-fit cursor-pointer rounded text-cyan-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
                Read the video transcript
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                {BRAND_VIDEO_TRANSCRIPT}
              </p>
            </details>
            <a
              href={BRAND_VIDEO_ASSETS.video}
              download="AI-CoreLogic-30s.mp4"
              className="shrink-0 text-slate-400 underline underline-offset-4 hover:text-cyan-300"
            >
              Download video · 1.44 MB
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
