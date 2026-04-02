/**
 * AI-CoreLogic Team Section
 * Theme: Deep Intelligence — professional team showcase with expertise highlights
 */

import { useEffect, useRef, useState } from "react";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="py-20 relative overflow-hidden" style={{ background: "#050B18" }}>
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={ref} className="container relative z-10">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">Our Leadership</div>
          <h2
            className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Meet <span className="gradient-text">Our Team</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            Driven by deep expertise in enterprise AI, cloud architecture, and digital transformation
          </p>
        </div>

        {/* Team Member Card */}
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: "rgba(13,27,46,0.6)",
              border: "1px solid rgba(0,212,200,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="grid grid-cols-1 gap-0">
              {/* Content Section */}
              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Our Founder
                  </h3>
                  <p
                    className="text-cyan-400 font-semibold mb-6"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Enterprise AI & Cloud Architecture | Founder
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-slate-300 text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Executive Profile
                      </p>
                      <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        Enterprise AI and Cloud Architecture leader with 25+ years of experience driving digital transformation across Fortune 500 companies. Expert in multi-cloud strategy, agentic AI platforms, and large-scale enterprise implementations.
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-300 text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Key Expertise
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Agentic AI",
                          "Multi-Cloud Architecture",
                          "Enterprise Transformation",
                          "RAG Pipelines",
                          "MLOps",
                          "Cloud Security",
                          "DevSecOps",
                          "AI Governance",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: "rgba(0,212,200,0.1)",
                              color: "#00D4C8",
                              border: "1px solid rgba(0,212,200,0.2)",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-300 text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Career Highlights
                      </p>
                      <ul className="text-slate-400 text-sm space-y-1" style={{ fontFamily: "var(--font-body)" }}>
                        <li>• Led $25M+ Oracle Cloud transformations across global enterprises</li>
                        <li>• Architected agentic AI platforms for drug discovery and life sciences</li>
                        <li>• Delivered $45M+ in annual client savings through cloud optimization</li>
                        <li>• Managed 50+ enterprise cloud and AI projects across AWS, GCP, Azure, Oracle</li>
                        <li>• Expert in AI governance, MLOps, and secure enterprise AI deployment</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-slate-300 text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Education & Certifications
                      </p>
                      <ul className="text-slate-400 text-sm space-y-1" style={{ fontFamily: "var(--font-body)" }}>
                        <li>• M.S. Data Science, Harvard University</li>
                        <li>• AWS Certified Solutions Architect</li>
                        <li>• GCP Data Engineering Architect</li>
                        <li>• IBM Cloud Professional Architect</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-700">

                  <a
                    href="tel:+1-727-318-9265"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-100"
                    style={{
                      background: "rgba(0,212,200,0.1)",
                      color: "#00D4C8",
                      border: "1px solid rgba(0,212,200,0.2)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Call</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/rodneychiasson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-100"
                    style={{
                      background: "rgba(0,212,200,0.1)",
                      color: "#00D4C8",
                      border: "1px solid rgba(0,212,200,0.2)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          {[
            { label: "Years Experience", value: "25+" },
            { label: "Enterprise Projects", value: "50+" },
            { label: "Client Savings", value: "$45M+" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl text-center transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: `${200 + i * 100}ms`,
                background: "rgba(13,27,46,0.5)",
                border: "1px solid rgba(0,212,200,0.08)",
              }}
            >
              <div
                className="text-2xl font-bold text-cyan-400 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
