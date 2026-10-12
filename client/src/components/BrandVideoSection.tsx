import { useRef, useState } from "react";
import { ArrowRight, Captions, Film, Play } from "lucide-react";

export const BRAND_VIDEO_ASSETS = {
  video: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663498118390/AlwrddDodnqFPndY.mp4",
  mobileVideo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663498118390/WnFKWGLIbZWAODvH.mp4",
  poster: "/media/ai-corelogic-brand-poster-v2-1280.webp",
  smallPoster: "/media/ai-corelogic-brand-poster-v2-640.webp",
  mediumPoster: "/media/ai-corelogic-brand-poster-v2-960.webp",
  captions: "/media/ai-corelogic-brand-30s-v1.en.vtt",
} as const;

export const BRAND_VIDEO_TRANSCRIPT =
  "Turn AI ambition into operating advantage. AI-CoreLogic helps businesses discover where AI can create value, design the right architecture, and bring it into everyday operations. From financial services to healthcare and life sciences, we connect strategy, implementation, and responsible governance. Diagnose. Architect. Operationalize. Built for real business. Visit AI-CoreLogic dot com and request your AI readiness briefing.";

type ConnectionHints = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
};

export function selectBrandVideo(width: number, connection?: ConnectionHints): string {
  const constrainedConnection = connection?.saveData ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "") ||
    (typeof connection?.downlink === "number" && connection.downlink > 0 && connection.downlink <= 1.5);
  return width < 768 || constrainedConnection
    ? BRAND_VIDEO_ASSETS.mobileVideo
    : BRAND_VIDEO_ASSETS.video;
}

export default function BrandVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: ConnectionHints }).connection;
    const source = activeSource ?? selectBrandVideo(window.innerWidth, connection);
    setActiveSource(source);
    setPlaybackError(false);
    setNeedsPlay(false);
    setLoading(true);
    // Set src and call play in the same user gesture, including on mobile Safari.
    // No MP4 or caption source is attached before this action.
    video.hidden = false;
    if (!activeSource || playbackError) {
      video.src = source;
      video.load();
    }
    video.focus({ preventScroll: true });
    void video.play().catch(() => {
      setLoading(false);
      setNeedsPlay(true);
    });
  };

  return (
    <section
      id="brand-video"
      aria-labelledby="brand-video-heading"
      className="relative scroll-mt-28 border-y border-cyan-400/10 bg-[#07111f] py-10 sm:py-14 lg:py-20"
    >
      <div className="container flex flex-col gap-6 sm:gap-9 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 lg:w-[32%] lg:shrink-0">
          <div className="mono-label mb-3 flex items-center gap-2 sm:mb-4">
            <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
            30-second mission briefing
          </div>
          <h2
            id="brand-video-heading"
            className="break-words text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            See AI ambition become <span className="gradient-text">operating advantage.</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400 sm:mt-5 sm:text-base sm:leading-7">
            Diagnose. Architect. Operationalize. A quick introduction to practical AI
            transformation, built around your business.
          </p>
          <a
            href="#contact"
            className="mt-4 inline-flex min-h-11 max-w-full items-center gap-2 rounded text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 sm:mt-6"
          >
            Request your AI readiness briefing
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
          <p id="brand-video-description" className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-400 sm:mt-5">
            <Captions className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            English voiceover and music. Captions available. Video loads only when you press play.
          </p>
        </div>

        <div className="w-full min-w-0 lg:flex-1">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-cyan-400/20 bg-[#050B18] shadow-[0_20px_70px_rgba(0,0,0,0.3)] sm:rounded-xl">
            {!activeSource && (
              <>
                <img
                  src={BRAND_VIDEO_ASSETS.smallPoster}
                  srcSet={`${BRAND_VIDEO_ASSETS.smallPoster} 640w, ${BRAND_VIDEO_ASSETS.mediumPoster} 960w, ${BRAND_VIDEO_ASSETS.poster} 1280w`}
                  sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, calc(100vw - 32px)"
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={startPlayback}
                  aria-label="Play the 30-second AI-CoreLogic video"
                  className="absolute inset-0 flex items-center justify-center bg-black/10 text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-cyan-400"
                >
                  <span className="flex min-h-12 items-center gap-2 rounded-full border border-cyan-300/60 bg-[#07111f]/95 px-4 py-3 text-sm font-semibold shadow-lg sm:px-6">
                    <Play className="h-5 w-5 fill-cyan-400 text-cyan-400" aria-hidden="true" />
                    Play video · 30 seconds
                  </span>
                </button>
              </>
            )}
            <video
              ref={videoRef}
              hidden={!activeSource}
              controls
              playsInline
              preload="none"
              width={1280}
              height={720}
              tabIndex={0}
              aria-label="AI-CoreLogic: Turn AI ambition into operating advantage"
              aria-describedby="brand-video-description"
              className="absolute inset-0 h-full w-full object-contain"
              onError={() => { setPlaybackError(true); setLoading(false); }}
              onLoadedData={() => { setPlaybackError(false); setLoading(false); }}
              onPlaying={() => { setLoading(false); setNeedsPlay(false); }}
            >
              {activeSource && (
                <track kind="captions" src={BRAND_VIDEO_ASSETS.captions} srcLang="en" label="English" />
              )}
              Your browser does not support embedded video. Use the download link below.
            </video>
          </div>
          <div role="status" aria-live="polite" className="text-sm leading-6 text-slate-400">
            {loading && <p className="mt-3">Loading video…</p>}
            {needsPlay && !playbackError && <p className="mt-3">Use the player’s play control to start the video.</p>}
            {playbackError && (
              <p className="mt-3 text-amber-300">
                The video could not be loaded. <button type="button" onClick={startPlayback} className="min-h-11 rounded px-2 underline underline-offset-4">Try again</button> or download it below.
              </p>
            )}
          </div>
          <div className="mt-3 flex min-w-0 flex-col gap-1 text-xs text-slate-400 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <details className="min-w-0 sm:flex-1">
              <summary className="min-h-11 w-fit cursor-pointer rounded py-3 text-cyan-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
                Read the video transcript
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{BRAND_VIDEO_TRANSCRIPT}</p>
            </details>
            <a
              href={activeSource ?? BRAND_VIDEO_ASSETS.mobileVideo}
              target="_blank"
              rel="noopener noreferrer"
              download="AI-CoreLogic-30s.mp4"
              className="inline-flex min-h-11 w-fit items-center rounded py-3 text-slate-400 underline underline-offset-4 hover:text-cyan-300"
            >
              Open/download video · {activeSource === BRAND_VIDEO_ASSETS.video ? "1.44" : "1.06"} MB
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
