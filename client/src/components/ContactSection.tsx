/**
 * AI-CoreLogic Contact Section
 * Theme: Deep Intelligence — contact info only (form removed)
 * Features: Contact info cards
 */

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

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
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=admin@ai-corelogic.com&su=AI%20Consulting%20Inquiry",
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
    href: "https://t.me/Aicorelogic_bot?start=hello",
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

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { trackCommunicationClick } = useAnalytics();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
            Ready to explore what AI can do for your business? Reach out to our team through any of the channels below.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
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
                      : info.isTelegram
                      ? "rgba(0,136,204,0.15)"
                      : "rgba(0,212,200,0.1)",
                    border: info.isWhatsApp
                      ? "1px solid rgba(37,211,102,0.35)"
                      : info.isTelegram
                      ? "1px solid rgba(0,136,204,0.35)"
                      : "1px solid rgba(0,212,200,0.2)",
                  }}
                >
                  {info.isWhatsApp ? (
                    <WhatsAppIcon className="w-4 h-4" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4" style={{ color: info.isTelegram ? "#0088CC" : "#00D4C8" }} strokeWidth={1.5} />
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
                onClick={(e) => {
                  if (info.isTelegram) {
                    trackCommunicationClick('telegram');
                  } else if (info.isWhatsApp) {
                    trackCommunicationClick('whatsapp');
                  } else if (info.label === 'Email Us') {
                    trackCommunicationClick('email');
                  } else if (info.label === 'Call Us') {
                    trackCommunicationClick('phone');
                  }
                }}
                className="glow-card p-5 rounded-xl flex items-start gap-4 cursor-pointer transition-all no-underline"
                style={{
                  textDecoration: "none",
                  border: info.isWhatsApp ? "1px solid rgba(37,211,102,0.25)" : info.isTelegram ? "1px solid rgba(0,136,204,0.25)" : undefined,
                }}
                onMouseEnter={(e) => {
                  if (info.isWhatsApp) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.6)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.05)";
                  } else if (info.isTelegram) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,136,204,0.6)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,136,204,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (info.isWhatsApp) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.25)";
                    (e.currentTarget as HTMLElement).style.background = "";
                  } else if (info.isTelegram) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,136,204,0.25)";
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
        </div>
      </div>
    </section>
  );
}
