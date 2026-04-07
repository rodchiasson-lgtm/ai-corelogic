/*
 * AI-CoreLogic Newsletter Section
 * Theme: Deep Intelligence — LinkedIn newsletter subscription hub
 * Features: Newsletter signup, benefits highlight, social proof
 */

import { useEffect, useRef, useState } from "react";
import { Mail, CheckCircle, Zap, TrendingUp, BookOpen, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: TrendingUp,
    title: "Weekly AI Insights",
    description: "Curated industry trends, research findings, and market analysis delivered to your inbox.",
  },
  {
    icon: BookOpen,
    title: "Implementation Guides",
    description: "Practical strategies and best practices for AI adoption in mid-sized organizations.",
  },
  {
    icon: Zap,
    title: "Exclusive Content",
    description: "Early access to whitepapers, case studies, and webinar invitations.",
  },
  {
    icon: Users,
    title: "Community Updates",
    description: "Connect with other business leaders navigating AI transformation.",
  },
];

export default function NewsletterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    
    // Simulate subscription (in production, this would call your backend)
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setLoading(false);
      toast.success("Welcome! Check your email for confirmation.");
    }, 1000);
  };

  return (
    <section id="newsletter" className="py-24 relative overflow-hidden" style={{ background: "#0D1B2E" }}>
      {/* Diagonal top */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: "#050B18",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <div ref={ref} className="container relative z-10 pt-8">
        {subscribed ? (
          // Success state
          <div
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-16 h-16" style={{ color: "#00D4C8" }} />
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Welcome to the{" "}
              <span className="gradient-text">Newsletter!</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Thank you for subscribing. We've sent a confirmation email to your inbox. Look for our first newsletter next week with exclusive AI insights and implementation strategies.
            </p>
            <button
              onClick={() => setSubscribed(false)}
              className="btn-outline-glow px-6 py-3 rounded-lg font-semibold"
            >
              Subscribe Another Email
            </button>
          </div>
        ) : (
          // Subscription form
          <div>
            {/* Header */}
            <div
              className={`mb-16 text-center transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="mono-label mb-3 flex justify-center items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: "#2563EB" }} />
                Stay Connected
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                AI Insights Delivered{" "}
                <span className="gradient-text">Weekly</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Join hundreds of business leaders receiving curated AI consulting insights, implementation strategies, and industry trends every week.
              </p>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Left: Benefits */}
              <div
                className={`space-y-4 transition-all duration-700 delay-100 ${
                  visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="glow-card p-5 rounded-xl transition-all duration-300 hover:translate-x-2"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}
                        >
                          <Icon className="w-5 h-5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h4
                            className="text-white font-bold text-sm mb-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {benefit.title}
                          </h4>
                          <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Subscription form */}
              <div
                className={`transition-all duration-700 delay-200 ${
                  visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                <div
                  className="glow-card p-8 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(0,212,200,0.05) 100%)",
                    border: "1px solid rgba(37,99,235,0.2)",
                  }}
                >
                  <h3
                    className="text-white font-bold text-2xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Subscribe Now
                  </h3>
                  <p className="text-slate-400 text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
                    Get weekly AI insights delivered to your inbox. Unsubscribe anytime.
                  </p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <label className="mono-label text-xs mb-2 block">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder-slate-500 transition-all duration-200 focus:outline-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(37,99,235,0.3)",
                          fontFamily: "var(--font-body)",
                        }}
                        onFocus={(e) => {
                          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(37,99,235,0.6)";
                          (e.currentTarget as HTMLInputElement).style.background = "rgba(255,255,255,0.08)";
                        }}
                        onBlur={(e) => {
                          (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(37,99,235,0.3)";
                          (e.currentTarget as HTMLInputElement).style.background = "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-base font-semibold transition-all duration-200"
                      style={{
                        background: "#2563EB",
                        color: "white",
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="inline-block animate-spin">⏳</span>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-slate-600 text-xs text-center" style={{ fontFamily: "var(--font-body)" }}>
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>

                  {/* Social proof */}
                  <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(37,99,235,0.2)" }}>
                    <p className="text-slate-500 text-xs mb-3" style={{ fontFamily: "var(--font-body)" }}>
                      <strong>Join 500+ subscribers</strong> including CTOs, founders, and business leaders
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, #2563EB, #00D4C8)`,
                            marginLeft: i > 1 ? "-8px" : "0",
                          }}
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <span className="text-slate-500 text-xs ml-2">+497 more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div
              className={`p-8 rounded-2xl text-center transition-all duration-700 delay-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
                border: "1px solid rgba(0,212,200,0.15)",
              }}
            >
              <h4
                className="text-white font-bold text-lg mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stay Ahead with Our AI Insights
              </h4>
              <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Every week: AI market trends • Implementation case studies • Process mining insights • Industry analysis • Exclusive webinar invitations • Early access to new research
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://rodchiasson-velon.wordpress.com/?_gl=1*h1mdp6*_gcl_au*MTY0MTU5ODI5NS4xNzc1NDkyMzM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                  style={{
                    color: "white",
                    background: "rgba(0,212,200,0.15)",
                    border: "1px solid rgba(0,212,200,0.3)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,212,200,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,200,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,212,200,0.15)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,200,0.3)";
                  }}
                >
                  Read Our Blog →
                </a>
                <span className="text-slate-500">or</span>
                <a
                  href="https://www.linkedin.com/company/109932965/"
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
        )}
      </div>
    </section>
  );
}
