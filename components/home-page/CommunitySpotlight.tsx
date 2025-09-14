import Image from "next/image";

export default function CommunitySpotlight() {
  const travelers = [
    {
      id: 1,
      name: "Mike's Story",
      description: "From a solo adventure to finding a travel buddy.",
      image: "/images/home/spotlight/mark.png",
      followers: "50.4k followers",
    },
    {
      id: 2,
      name: "Sarah's Adventure",
      description: "Discovering hidden gems across Southeast Asia.",
      image: "/images/home/spotlight/sarah.png",
      followers: "42.3k followers",
    },
    {
      id: 3,
      name: "Friendships Found",
      description: "How travel brought lifelong friendships.",
      image: "/images/home/spotlight/friendship-found.png",
      followers: "38.1k followers",
    },
    {
      id: 4,
      name: "Capturing Moments",
      description: "Through the lens of a travel photographer.",
      image: "/images/home/spotlight/capturing-moments.png",
      followers: "55.7k followers",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-primary font-garetheavy text-3xl md:text-4xl">
            Community Spotlight: TravlBirdies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-poppins">
          {travelers.map((traveler) => (
            <div key={traveler.id}>
              <div className="overflow-hidden rounded-[18px]">
                <div className="relative aspect-[16/15]">
                  <Image
                    src={traveler.image}
                    alt={traveler.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-900 md:text-xl">{traveler.name}</h3>
                <p className="text-neutral-500 leading-6 font-light text-sm md:text-base mt-1">
                  {traveler.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
