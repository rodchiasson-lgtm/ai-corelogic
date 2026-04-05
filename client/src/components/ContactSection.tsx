/*
 * AI-CoreLogic Contact Section
 * Theme: Deep Intelligence — contact form with dark styling
 * Features: Contact form, contact info cards
 */

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "17273189265";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'm interested in learning more about AI-CoreLogic's consulting services.");

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L.929 23.589l8.257-2.414a9.9 9.9 0 004.736 1.204h.004c5.44 0 9.902-4.413 9.914-9.85.002-2.631-.674-5.159-1.95-7.39-1.277-2.23-3.055-4.113-5.282-5.39-2.226-1.277-4.755-1.968-7.358-1.968z" />
  </svg>
);

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "admin@ai-corelogic.com",
    sub: "We respond within 24 hours",
    href: "mailto:admin@ai-corelogic.com",
    isWhatsApp: false,
    isTelegram: false,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (727) 318-9265",
    sub: "Mon–Fri, 9am–6pm EST",
    href: "tel:+17273189265",
    isWhatsApp: false,
    isTelegram: false,
  },
  {
    icon: MapPin,
    label: "Global Offices",
    value: "London, UK & New York, USA",
    sub: "Serving clients worldwide",
    href: undefined,
    isWhatsApp: false,
    isTelegram: false,
  },
  {
    icon: MessageCircle,
    label: "Chat on Telegram",
    value: "@Aicorelogic_bot",
    sub: "Instant responses 24/7",
    href: "https://t.me/Aicorelogic_bot",
    isWhatsApp: false,
    isTelegram: true,
  },
  {
    icon: null,
    label: "Chat on WhatsApp",
    value: "+1 (727) 318-9265",
    sub: "Quick replies 24/7",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
    isWhatsApp: true,
    isTelegram: false,
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
                to: "admin@ai-corelogic.com",
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
              const isClickable = !!info.href;

              const cardContent = (
                <>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: info.isWhatsApp
                        ? "rgba(37,211,102,0.15)"
                        : "rgba(0,212,200,0.1)",
                      border: info.isWhatsApp
                        ? "1px solid rgba(37,211,102,0.35)"
                        : "1px solid rgba(0,212,200,0.2)",
                    }}
                  >
                    {info.isWhatsApp ? (
                      <WhatsAppIcon className="w-4 h-4" style={{ color: "#25D366" } as React.CSSProperties} />
                    ) : Icon ? (
                      <Icon className="w-4 h-4" style={{ color: "#00D4C8" }} strokeWidth={1.5} />
                    ) : null}
                  </div>
                  <div>
                    <div className="mono-label text-xs mb-0.5">{info.label}</div>
                    <div
                      className="text-white font-semibold text-sm"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: info.isTelegram ? "#00D4C8" : info.isWhatsApp ? "#25D366" : "white",
                      }}
                    >
                      {info.value}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      {info.sub}
                    </div>
                  </div>
                </>
              );

              return isClickable ? (
                <a
                  key={info.label}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-card p-5 rounded-xl flex items-start gap-4 cursor-pointer transition-all no-underline"
                  style={{
                    textDecoration: "none",
                    border: info.isWhatsApp ? "1px solid rgba(37,211,102,0.25)" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (info.isWhatsApp) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.6)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (info.isWhatsApp) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.25)";
                      (e.currentTarget as HTMLElement).style.background = "";
                    }
                  }}
                >
                  {cardContent}
                </a>
              ) : (
                <div
                  key={info.label}
                  className="glow-card p-5 rounded-xl flex items-start gap-4"
                >
                  {cardContent}
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
