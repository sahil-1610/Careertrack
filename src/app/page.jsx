import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Testimonials from "@/components/TestiomonialCards";
import Mentorsintro from "@/components/Mentorsintro";
import Footer from "@/components/Footer";
import CareerPath from "@/components/CareerPath";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <HeroSection />
      <Features />
      <Testimonials />
      <CareerPath/>
      <Mentorsintro />
      <CallToAction/>
      <Footer />
    </main>
  );
}
