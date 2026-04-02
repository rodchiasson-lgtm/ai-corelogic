/**
 * AI-CoreLogic WhatsApp Widget
 * Theme: Deep Intelligence — floating WhatsApp button with quick access
 */

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "447700123456"; // UK number format: +44 7700 123456 (replace with your actual number)
const WHATSAPP_MESSAGE = "Hi! I'm interested in learning more about AI-CoreLogic's consulting services.";

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show widget after 5 seconds (after Telegram widget)
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    // Create WhatsApp link with pre-filled message
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        className="fixed bottom-24 right-6 z-40 animate-fade-in"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute bottom-16 right-0 px-4 py-2 rounded-lg text-sm font-medium text-white whitespace-nowrap mb-2 animate-fade-in"
            style={{
              background: "rgba(37,211,102,0.95)",
              backdropFilter: "blur(10px)",
              fontFamily: "var(--font-body)",
            }}
          >
            Chat with us on WhatsApp
            <div
              className="absolute -bottom-1 right-4 w-2 h-2 transform rotate-45"
              style={{ background: "rgba(37,211,102,0.95)" }}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            boxShadow: "0 8px 24px rgba(37,211,102,0.3)",
          }}
          aria-label="Open WhatsApp Chat"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L.929 23.589l8.257-2.414a9.9 9.9 0 004.736 1.204h.004c5.44 0 9.902-4.413 9.914-9.85.002-2.631-.674-5.159-1.95-7.39-1.277-2.23-3.055-4.113-5.282-5.39-2.226-1.277-4.755-1.968-7.358-1.968z" />
          </svg>
        </button>

        {/* Pulse animation */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: "rgba(37,211,102,0.2)",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
