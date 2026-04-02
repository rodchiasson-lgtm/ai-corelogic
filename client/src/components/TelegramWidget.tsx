/**
 * AI-CoreLogic Telegram Widget
 * Theme: Deep Intelligence — floating Telegram button with quick access
 */

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const TELEGRAM_BOT_USERNAME = "Aicorelogic_bot"; // Official bot username

export default function TelegramWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show widget after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleTelegramClick = () => {
    // Open Telegram bot in new window
    window.open(`https://t.me/${TELEGRAM_BOT_USERNAME}`, "_blank");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Telegram Button */}
      <div
        className="fixed bottom-6 right-6 z-40 animate-fade-in"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute bottom-16 right-0 px-4 py-2 rounded-lg text-sm font-medium text-white whitespace-nowrap mb-2 animate-fade-in"
            style={{
              background: "rgba(0,212,200,0.95)",
              backdropFilter: "blur(10px)",
              fontFamily: "var(--font-body)",
            }}
          >
            Chat with us on Telegram
            <div
              className="absolute -bottom-1 right-4 w-2 h-2 transform rotate-45"
              style={{ background: "rgba(0,212,200,0.95)" }}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleTelegramClick}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #00D4C8 0%, #0099CC 100%)",
            boxShadow: "0 8px 24px rgba(0,212,200,0.3)",
          }}
          aria-label="Open Telegram Chat"
        >
          <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
        </button>

        {/* Pulse animation */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: "rgba(0,212,200,0.2)",
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
