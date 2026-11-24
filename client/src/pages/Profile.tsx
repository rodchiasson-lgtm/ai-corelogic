/*
 * AI-CoreLogic — Founder Profile
 * Hosts every section of Rodney Chiasson's portfolio (rodneyai-hrrqprhm.manus.space)
 * inside the AI-CoreLogic site. The portfolio markup is rendered as-is and its
 * styles are scoped under .rc-profile so they never leak into the rest of the site.
 */

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import profileBodyRaw from "./profile/profile-body.html?raw";
import "./profile/profile.css";
import { sitePath } from "@/lib/sitePath";

/** The original portfolio, which also serves the live news and résumé Q&A endpoints. */
export const PORTFOLIO_URL = "https://rodneyai-hrrqprhm.manus.space";

/** Files shipped under /profile/ (résumé, articles, RSS) follow the deploy base path. */
const profileBody = profileBodyRaw.replaceAll('"/profile', `"${sitePath("/profile")}`);

const subnav = [
  { label: "Overview", href: "#top" },
  { label: "Film", href: "#film" },
  { label: "Selected work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "GitHub", href: "#github" },
  { label: "Journal", href: "#journal" },
  { label: "Credentials", href: "#credentials" },
  { label: "Contact", href: "#contact" },
];

type NewsItem = { title: string; link: string; publisher: string; date?: string };

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Wires up the interactive parts of the portfolio (film tabs, news, RSS copy, résumé Q&A). */
function attachBehaviours(root: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(el: Element | Document | null | undefined, type: K | string, fn: (e: any) => void) => {
    if (!el) return;
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // In-page anchors scroll within the profile instead of navigating.
  on(root, "click", (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const target = id ? root.querySelector(`#${CSS.escape(id)}`) : null;
    if (!target) return;
    e.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });

  // Film: switch between the full film and the 30-second cut.
  const video = $<HTMLVideoElement>("#film-video");
  root.querySelectorAll<HTMLButtonElement>(".film-tab").forEach((tab, _i, tabs) => {
    on(tab, "click", () => {
      if (!video || tab.classList.contains("is-active")) return;
      tabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-pressed", String(t === tab));
      });
      video.removeAttribute("poster");
      video.src = tab.dataset.src || "";
      video.load();
      video.play().catch(() => {});
    });
  });

  // News: refresh from the portfolio's feed endpoint; keep the bundled snapshot if it is unreachable.
  const stream = $("#news-stream");
  const status = $("#news-status");
  const refresh = $("#refresh-news");
  let newsTimer: number | undefined;
  async function loadNews(manual = false) {
    if (!stream) return;
    if (manual && status) status.textContent = "Checking publisher feeds…";
    try {
      const res = await fetch(`${PORTFOLIO_URL}/api/news${manual ? `?refresh=${Date.now()}` : ""}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Feed unavailable");
      const data = (await readJson(res)) as { items?: NewsItem[]; updatedAt?: string } | null;
      if (!data?.items?.length) throw new Error("No items");
      stream.replaceChildren();
      for (const item of data.items) {
        const a = document.createElement("a");
        a.className = "news-item";
        a.href = item.link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        const strong = document.createElement("strong");
        strong.textContent = item.title;
        const span = document.createElement("span");
        span.textContent = `${item.publisher}${item.date ? ` · ${new Date(item.date).toLocaleDateString()}` : ""}`;
        a.append(strong, span);
        stream.append(a);
      }
      if (status) status.textContent = `Latest publisher headlines · updated ${new Date(data.updatedAt || Date.now()).toLocaleString()}`;
    } catch {
      if (status) status.textContent = "Recent publisher headlines (snapshot). Each item links to its publisher.";
    }
  }
  if (stream) {
    loadNews();
    on(refresh, "click", () => loadNews(true));
    newsTimer = window.setInterval(() => loadNews(), 15 * 60 * 1000);
    cleanups.push(() => window.clearInterval(newsTimer));
  }

  // RSS: show this site's absolute feed URL and wire the copy button.
  const feedUrl = `${window.location.origin}${sitePath("/profile/rss.xml")}`;
  const rssCode = $("#rss-url");
  if (rssCode) rssCode.textContent = feedUrl;
  root.querySelectorAll<HTMLAnchorElement>("a[href*='feedly.com']").forEach((a) => {
    a.href = `https://feedly.com/i/subscription/feed/${PORTFOLIO_URL}/rss.xml`;
  });
  const copy = $<HTMLButtonElement>("#copy-rss");
  on(copy, "click", async () => {
    const note = $("#rss-copy-status");
    try {
      await navigator.clipboard.writeText(feedUrl);
      if (note) note.textContent = "RSS feed URL copied.";
      if (copy) copy.textContent = "Copied";
    } catch {
      if (note) note.textContent = `Copy this feed URL: ${feedUrl}`;
    }
  });

  // Résumé Q&A dialog.
  const dialog = $("#resume-ask");
  const openBtn = $<HTMLButtonElement>("#resume-ask-open");
  const closeBtn = $<HTMLButtonElement>("#resume-ask-close");
  const answer = $<HTMLElement>("#resume-ask-answer");
  const form = $<HTMLFormElement>("#resume-ask-form");
  const input = $<HTMLTextAreaElement>("#resume-ask-input");
  const submit = $<HTMLButtonElement>("#resume-ask-submit");
  const close = () => {
    dialog?.classList.remove("is-open");
    dialog?.setAttribute("aria-hidden", "true");
    openBtn?.focus();
  };
  on(openBtn, "click", () => {
    dialog?.classList.add("is-open");
    dialog?.setAttribute("aria-hidden", "false");
    closeBtn?.focus();
  });
  on(closeBtn, "click", close);
  on(dialog, "click", (e: MouseEvent) => {
    if (e.target === dialog) close();
  });
  on(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && dialog?.classList.contains("is-open")) close();
  });
  async function ask(question: string) {
    if (!input || !answer) return;
    const out = answer.querySelector("p");
    input.value = question;
    answer.hidden = false;
    if (out) out.textContent = "Checking the résumé…";
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Thinking…";
    }
    try {
      const res = await fetch(`${PORTFOLIO_URL}/api/resume-qa`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await readJson(res)) as { answer?: string; error?: string } | null;
      if (!data || typeof data !== "object") throw new Error("empty");
      if (!res.ok || typeof data.answer !== "string" || !data.answer.trim()) throw new Error(data.error || "no answer");
      if (out) out.textContent = data.answer.trim();
    } catch {
      if (out) {
        out.textContent = "The résumé Q&A service can't be reached from here right now. The full résumé is linked below, and the live assistant is available on Rodney's portfolio site.";
      }
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Ask question ↗";
      }
    }
  }
  root.querySelectorAll<HTMLElement>("[data-question]").forEach((btn) => on(btn, "click", () => ask(btn.dataset.question || "")));
  on(form, "submit", (e: SubmitEvent) => {
    e.preventDefault();
    ask(input?.value.trim() || "");
  });

  return () => cleanups.forEach((fn) => fn());
}

export default function Profile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Rodney Chiasson — Founder Profile | AI-CoreLogic";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const detach = attachBehaviours(root);
    // Honour a deep link such as /profile#experience once the markup is in place.
    const id = window.location.hash.slice(1);
    if (id) {
      const frame = window.requestAnimationFrame(() => root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ block: "start" }));
      return () => {
        window.cancelAnimationFrame(frame);
        detach();
      };
    }
    return detach;
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#07111d" }}>
      <Navbar />
      <div ref={ref} className="rc-profile" id="founder-profile">
        <div className="h-16 lg:h-20" aria-hidden="true" />
        <nav className="profile-subnav" aria-label="Founder profile sections">
          {subnav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            Portfolio site ↗
          </a>
        </nav>
        <main id="main-content" dangerouslySetInnerHTML={{ __html: profileBody }} />
      </div>
      <Footer />
    </div>
  );
}
