/*
 * AI-CoreLogic Services Section
 * Theme: Deep Intelligence — frosted glass service cards with glow hover
 * Services: Discovery, Implementation, Research, Maturity
 */

import { useEffect, useRef, useState } from "react";
import { Search, Cpu, FlaskConical, BarChart3, ArrowRight } from "lucide-react";

const DISCOVERY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/ai-discovery-GRHS9siDnp4junhcxyiwTQ.webp";
const IMPLEMENTATION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/ai-implementation-TDPKaBbQUbEitwFprPbkWN.webp";
const MATURITY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498118390/juLcehvUK8ZLccnz5JYQE8/ai-maturity-2GQqcduSRxTQypoeMjASWj.webp";

const services = [
  {
    id: "01",
    icon: Search,
    title: "AI Discovery",
    subtitle: "Identify Your AI Opportunity",
    description:
      "We conduct deep-dive assessments of your business processes, data assets, and competitive landscape to uncover high-impact AI opportunities. Our discovery phase delivers a clear, prioritized roadmap tailored to your specific goals and constraints.",
    bullets: [
      "Business process analysis & gap mapping",
      "Data readiness assessment",
      "AI opportunity scoring & prioritization",
      "Custom AI strategy roadmap",
    ],
    image: DISCOVERY_IMG,
    color: "#00D4C8",
  },
  {
    id: "02",
    icon: Cpu,
    title: "AI Implementation",
    subtitle: "Build & Deploy with Precision",
    description:
      "From model selection and data engineering to deployment and monitoring, our implementation team handles the full technical lifecycle. We integrate AI solutions seamlessly into your existing systems with minimal disruption.",
    bullets: [
      "Custom model development & fine-tuning",
      "Data pipeline engineering",
      "System integration & API development",
      "Production deployment & monitoring",
    ],
    image: IMPLEMENTATION_IMG,
    color: "#2563EB",
  },
  {
    id: "03",
    icon: FlaskConical,
    title: "AI Research",
    subtitle: "Stay Ahead of the Curve",
    description:
      "Our research practice keeps your organization at the frontier of AI advancement. We evaluate emerging models, conduct feasibility studies, and translate cutting-edge research into actionable business intelligence.",
    bullets: [
      "Emerging AI technology evaluation",
      "Proof-of-concept development",
      "Competitive AI landscape analysis",
      "Academic & industry research synthesis",
    ],
    image: null,
    color: "#00D4C8",
  },
  {
    id: "04",
    icon: BarChart3,
    title: "AI Maturity",
    subtitle: "Measure, Optimize & Scale",
    description:
      "We assess your organization's AI maturity across five dimensions — strategy, data, technology, talent, and governance — and provide a structured framework to advance from experimentation to enterprise-scale AI operations.",
    bullets: [
      "5-dimension AI maturity assessment",
      "Organizational AI capability benchmarking",
      "Governance & ethics framework design",
      "Scaling strategy & change management",
    ],
    image: MATURITY_IMG,
    color: "#2563EB",
    link: "https://gamma.app/generations/rO0twuAOr7KjWARyzcQaV",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = service.icon;

  return (
    <div
      ref={ref}
      className={`glow-card rounded-2xl overflow-hidden transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Card image header */}
      {service.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-60 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2E] via-transparent to-transparent" />
          <div
            className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${service.color}20`, border: `1px solid ${service.color}40` }}
          >
            <Icon className="w-5 h-5" style={{ color: service.color }} strokeWidth={1.5} />
          </div>
          <div className="absolute top-4 right-4 mono-label text-xs">{service.id}</div>
        </div>
      )}

      <div className="p-6">
        {/* Icon (for cards without image) */}
        {!service.image && (
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}
            >
              <Icon className="w-6 h-6 icon-glow" style={{ color: service.color }} strokeWidth={1.5} />
            </div>
            <span className="mono-label">{service.id}</span>
          </div>
        )}

        <div className="mono-label mb-1">{service.subtitle}</div>
        <h3
          className="text-xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {service.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
          {service.description}
        </p>

        {/* Bullets */}
        <ul className="space-y-2 mb-5">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.color }} />
              {b}
            </li>
          ))}
        </ul>

        {service.link ? (
          <a
            href={service.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: service.color, fontFamily: "var(--font-display)", textDecoration: "none" }}
          >
            View Assessment <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: service.color, fontFamily: "var(--font-display)" }}
          >
            Learn More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-24 relative" style={{ background: "#050B18" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #00D4C8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <div
          ref={titleRef}
          className={`mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">What We Do</div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            End-to-End{" "}
            <span className="gradient-text">AI Services</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            From initial discovery through to enterprise-scale deployment, we guide your organization through every stage of the AI adoption journey.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
