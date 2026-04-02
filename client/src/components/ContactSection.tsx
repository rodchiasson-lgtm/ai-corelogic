/*
 * AI-CoreLogic Contact Section
 * Theme: Deep Intelligence — contact form with dark styling
 * Features: Contact form, contact info cards
 */

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "rodchiasson@ai-corelogic.com",
    sub: "We respond within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (727) 318-9265",
    sub: "Mon–Fri, 9am–6pm EST",
  },
  {
    icon: MapPin,
    label: "Global Offices",
    value: "London, UK & New York, USA",
    sub: "Serving clients worldwide",
  },
];

const services = [
  "AI Discovery & Strategy",
  "AI Implementation",
  "AI Research",
  "AI Maturity Assessment",
  "AI Training & Enablement",
  "Other",
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Send email via API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "rodchiasson@ai-corelogic.com",
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", company: "", service: "", message: "" });
        toast.success("Message sent! We'll be in touch within 24 hours.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg text-white text-sm placeholder-slate-500 transition-all duration-200 focus:outline-none`;
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,212,200,0.15)",
    fontFamily: "var(--font-body)",
  };

  return (
    <section id="contact" className="py-24 relative" style={{ background: "#0D1B2E" }}>
      {/* Diagonal top */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: "#050B18",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)",
        }}
      />

      <div ref={ref} className="container relative z-10 pt-8">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="mono-label mb-3">Get In Touch</div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            Start Your{" "}
            <span className="gradient-text">AI Journey</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
            Ready to explore what AI can do for your business? Book a no-obligation discovery call with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Contact info */}
          <div
            className={`space-y-4 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="glow-card p-5 rounded-xl flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,200,0.1)", border: "1px solid rgba(0,212,200,0.2)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="mono-label text-xs mb-0.5">{info.label}</div>
                    <div className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                      {info.value}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      {info.sub}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Availability badge */}
            <div
              className="p-5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(37,99,235,0.05) 100%)",
                border: "1px solid rgba(0,212,200,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="pulse-dot" />
                <span className="mono-label text-xs">Currently Accepting Clients</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                We have limited capacity for new engagements. Book early to secure your discovery call.
              </p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            {submitted ? (
              <div className="glow-card p-10 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-80">
                <CheckCircle className="w-12 h-12 mb-4" style={{ color: "#00D4C8" }} />
                <h3
                  className="text-white font-bold text-2xl mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Message Received!
                </h3>
                <p className="text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                  Thank you for reaching out. A member of our team will contact you within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 btn-outline-glow px-5 py-2.5 rounded-lg text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glow-card p-8 rounded-2xl space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="mono-label text-xs mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      className={inputClass}
                      style={inputStyle}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mono-label text-xs mb-2 block">Work Email *</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      className={inputClass}
                      style={inputStyle}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="mono-label text-xs mb-2 block">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      className={inputClass}
                      style={inputStyle}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mono-label text-xs mb-2 block">Service of Interest</label>
                    <select
                      className={inputClass}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option value="" style={{ background: "#0D1B2E" }}>Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s} style={{ background: "#0D1B2E" }}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mono-label text-xs mb-2 block">Tell Us About Your Project *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your business challenge, current AI maturity, and what you're hoping to achieve..."
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold transition-opacity"
                  style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-slate-600 text-xs text-center" style={{ fontFamily: "var(--font-body)" }}>
                  By submitting this form, you agree to our Privacy Policy. We never share your information.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
