import NewHeader from "@/components/home-page/NewHeader";
import NewHeroSection from "@/components/home-page/NewHeroSection";
import FilterButtons from "@/components/home-page/FilterButtons";
import TrendingAdventures from "@/components/home-page/TrendingAdventures";
import FeaturedCurators from "@/components/home-page/FeaturedCurators";
import TravelReels from "@/components/home-page/TravelReels";
import Testimonials from "@/components/home-page/Testimonials";
import NewsletterSignup from "@/components/home-page/NewsletterSignup";
import NewFooter from "@/components/home-page/NewFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NewHeader />
      <main className="flex-1 bg-background-dark">
        <NewHeroSection />
        <FilterButtons />
        <TrendingAdventures />
        <FeaturedCurators />
        <TravelReels />
        <Testimonials />
        <NewsletterSignup />
      </main>
      <NewFooter />
    </div>
  );
}
