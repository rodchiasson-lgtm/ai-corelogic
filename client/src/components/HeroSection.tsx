/*
 * AI-CoreLogic Hero Section
 * Theme: Deep Intelligence — full-bleed dark hero, asymmetric layout
 * Features: Animated particle dots, gradient text headline, CTA buttons
 */

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/hero-bg-QTpdhF95r24ScsXKEygQNG.webp";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 200, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 200, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleScroll = () => {
    const el = document.querySelector("#services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "#050B18", minHeight: "100vh" }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 animate-glow"
        style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-5 animate-glow"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="container relative z-10 flex items-center" style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "10rem" }}>
        <div className="max-w-3xl">
          {/* Mono label */}
          <div
            className={`mono-label flex items-center gap-3 mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="pulse-dot inline-block" />
            AI Consulting for SMBs — Precision-Driven Transformation
          </div>

          {/* Main headline */}
          <h1
            className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F8FAFC",
            }}
          >
            Unlock the Power of{" "}
            <span className="gradient-text">AI Intelligence</span>
            <br />
            for Your Business
          </h1>

          {/* Subheadline */}
          <p
            className={`mt-6 text-lg text-slate-300 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            AI-CoreLogic delivers end-to-end AI consulting — from discovery and strategic research to full implementation and maturity assessment — tailored for small to mid-sized companies ready to compete at scale.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-wrap gap-4 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <button
              onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-semibold"
            >
              Start Your AI Journey
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { const el = document.querySelector("#services"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-outline-glow flex items-center gap-2 px-7 py-3.5 rounded-lg text-base"
            >
              Explore Services
            </button>
          </div>

          {/* Trust badges */}
          <div
            className={`mt-12 flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {[
              { value: "150+", label: "SMBs Transformed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "12+", label: "Years of Expertise" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div>
                  <div
                    className="gradient-text font-bold text-2xl leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                    {stat.label}
                  </div>
                </div>
                {i < 2 && <div className="w-px h-8" style={{ background: "rgba(0,212,200,0.2)" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted by band */}
      <div className="absolute bottom-20 left-0 right-0">
        <div className="container">
          <div
            className={`transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <p className="mono-label text-xs mb-4 opacity-50">Trusted by businesses across industries</p>
            <div className="flex flex-wrap gap-6 items-center">
              {["Meridian Logistics", "Vertex Healthcare", "Bloom Retail", "Pinnacle Finance", "Apex Manufacturing"].map((name) => (
                <span
                  key={name}
                  className="text-slate-600 text-sm font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
        aria-label="Scroll down"
      >
        <span className="mono-label text-xs">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
