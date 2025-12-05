import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { SystemsSection } from "@/components/systems-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <SystemsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
