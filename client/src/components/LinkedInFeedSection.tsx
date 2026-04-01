/*
 * AI-CoreLogic LinkedIn Feed Section
 * Theme: Deep Intelligence — embedded LinkedIn feed with latest posts
 * Features: Live LinkedIn profile feed, latest posts, engagement
 */

import { useEffect, useRef, useState } from "react";
import { Linkedin, ExternalLink } from "lucide-react";

export default function LinkedInFeedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          // Load LinkedIn embed script after component is visible
          setTimeout(() => {
            if ((window as any).IN?.parse) {
              (window as any).IN.parse();
            } else {
              const script = document.createElement("script");
              script.src = "https://platform.linkedin.com/in.js";
              script.async = true;
              script.defer = true;
              document.body.appendChild(script);
            }
          }, 100);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="linkedin-feed" className="py-24 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3 flex items-center gap-2">
            <Linkedin className="w-4 h-4" style={{ color: "#2563EB" }} />
            Latest Updates
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              LinkedIn{" "}
              <span className="gradient-text">Feed</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md lg:text-right" style={{ fontFamily: "var(--font-body)" }}>
              Follow along with the latest insights, industry trends, and AI consulting updates from our team.
            </p>
          </div>
        </div>

        {/* LinkedIn Feed Container */}
        <div
          className={`grid lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main feed - LinkedIn embed */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(13,27,46,0.5)",
                border: "1px solid rgba(0,212,200,0.15)",
                padding: "24px",
                minHeight: "600px",
              }}
            >
              {/* LinkedIn Profile Embed */}
              <div className="space-y-6">
                {/* Embed the LinkedIn profile feed */}
                <iframe
                  src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7180000000000000000"
                  height="400"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  title="LinkedIn Feed"
                  style={{ borderRadius: "12px", border: "1px solid rgba(0,212,200,0.1)" }}
                />

                {/* Call-to-action to view profile */}
                <div
                  className="p-6 rounded-xl text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
                    border: "1px solid rgba(37,99,235,0.2)",
                  }}
                >
                  <p className="text-slate-300 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                    Want to see more? Visit the full LinkedIn profile for all posts, articles, and updates.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/rodneychiasson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      background: "#2563EB",
                      color: "white",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#2563EB";
                    }}
                  >
                    <Linkedin className="w-4 h-4" />
                    View Full Profile
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Feed highlights */}
          <div className="space-y-4">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(13,27,46,0.5)",
                border: "1px solid rgba(0,212,200,0.15)",
              }}
            >
              <h3
                className="text-white font-bold text-lg mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Why Follow?
              </h3>
              <ul className="space-y-3">
                {[
                  "Latest AI & process mining insights",
                  "Industry trends & research findings",
                  "Implementation best practices",
                  "Thought leadership articles",
                  "Team updates & announcements",
                  "Exclusive webinar invitations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)" }}
                    >
                      <span className="text-xs font-bold" style={{ color: "#2563EB" }}>✓</span>
                    </div>
                    <span className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LinkedIn stats card */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
                border: "1px solid rgba(37,99,235,0.2)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Linkedin className="w-5 h-5" style={{ color: "#2563EB" }} />
                <span className="text-white font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Connect
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Join thousands of professionals following AI-CoreLogic for insights and industry updates.
              </p>
              <a
                href="https://www.linkedin.com/in/rodneychiasson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold"
                style={{ color: "#2563EB", textDecoration: "none" }}
              >
                Follow on LinkedIn →
              </a>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div
          className={`mt-12 p-6 rounded-2xl transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
            border: "1px solid rgba(0,212,200,0.15)",
          }}
        >
          <p className="text-slate-400 text-sm text-center" style={{ fontFamily: "var(--font-body)" }}>
            <strong className="text-white">Pro tip:</strong> Subscribe to our LinkedIn newsletter for weekly AI consulting insights, case studies, and industry analysis delivered directly to your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
