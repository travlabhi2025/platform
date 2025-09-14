import Image from "next/image";
import SearchDropdown from "./SearchDropdown";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/TravelAbhiHero.png"
          alt="Travel Adventure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="max-w-full text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white my-32 font-garetheavy">
            Travel More with TravlAbhi
          </h1>

          {/* Search Dropdown */}
          <SearchDropdown />
        </div>
      </div>
    </section>
  );
}
