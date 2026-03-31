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
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <IndustriesSection />
      <ResearchSection />
      <TestimonialsSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
