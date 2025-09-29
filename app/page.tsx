import Header from "@/components/home-page/Header";
import HeroSection from "@/components/home-page/HeroSection";
import TopDestinations from "@/components/home-page/TopDestinations";
import BookingSteps from "@/components/home-page/BookingSteps";
import CommunitySpotlight from "@/components/home-page/CommunitySpotlight";
import WhyTravlAbhi from "@/components/home-page/WhyTravlAbhi";
import OrganizerCTA from "@/components/home-page/OrganizerCTA";
import PricingSection from "@/components/home-page/PricingSection";
import Footer from "@/components/home-page/Footer";
import Experiences from "@/components/home-page/Experiences";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <Header />
      <HeroSection />
      <TopDestinations />
      <BookingSteps />
      <CommunitySpotlight />
      <WhyTravlAbhi />
      <OrganizerCTA />
      <PricingSection />
      <Experiences />
      <Footer />
    </main>
  );
}
