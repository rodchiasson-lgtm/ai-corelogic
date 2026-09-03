/*
 * AI-CoreLogic Home Page
 * Theme: Deep Intelligence — Aerospace HMI meets Premium Dark SaaS
 * Sections: Hero → Stats → Services → Process → About → Industries → Research → Testimonials → CTA → Contact → Footer
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import IndustriesSection from "@/components/IndustriesSection";
import ResearchSection from "@/components/ResearchSection";
import ResourcesSection from "@/components/ResourcesSection";

import NewsletterSection from "@/components/NewsletterSection";
import BlogSection from "@/components/BlogSection";
import CategoryGrid from "@/components/CategoryGrid";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import MapSection from "@/components/MapSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="site-shell min-h-screen" style={{ background: "#050B18" }}>
      <aside className="mission-rail" aria-hidden="true">
        <span className="mission-rail__status" />
        <span>ACL / ONLINE</span>
        <span>46°49′N</span>
        <span>MISSION SYSTEM</span>
      </aside>
      <Navbar />
      <main className="hmi-flow">
        <HeroSection />
        <StatsSection />
        <div className="hmi-stage hmi-stage--port" data-module="MISSION / 01"><ServicesSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="FLIGHTPLAN / 02"><ProcessSection /></div>
        <div className="hmi-stage hmi-stage--port" data-module="SYSTEM / 03"><AboutSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="SECTORS / 04"><IndustriesSection /></div>
        <div className="hmi-stage hmi-stage--port" data-module="RESEARCH / 05"><ResearchSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="LIBRARY / 06"><ResourcesSection /></div>
        <div className="hmi-stage hmi-stage--port" data-module="SIGNAL / 07"><NewsletterSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="INTELLIGENCE / 08"><BlogSection /></div>
        <div className="hmi-stage hmi-stage--port" data-module="INDEX / 09"><CategoryGrid /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="CREW / 10"><TeamSection /></div>
        <div className="hmi-stage hmi-stage--port" data-module="OUTCOMES / 11"><TestimonialsSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="INITIATE / 12"><CTABanner /></div>
        <div className="hmi-stage hmi-stage--port" data-module="COORDINATES / 13"><MapSection /></div>
        <div className="hmi-stage hmi-stage--starboard" data-module="UPLINK / 14"><ContactSection /></div>
      </main>
      <Footer />
    </div>
  );
}
