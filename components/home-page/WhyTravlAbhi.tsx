import Image from "next/image";

export default function WhyTravlAbhi() {
  const features = [
    {
      id: 1,
      icon: "/images/home/services/dish.svg",
      title: "Discover Your Preferences",
      description:
        "Find trips that match your interests and travel style with our smart recommendation system.",
    },
    {
      id: 2,
      icon: "/images/home/services/airplane.svg",
      title: "Global Destinations",
      description:
        "Explore destinations worldwide with our extensive network and local expertise.",
    },
    {
      id: 3,
      icon: "/images/home/services/mic.svg",
      title: "Safe & Secure",
      description:
        "Travel with confidence knowing your safety and security are our top priorities.",
    },
    {
      id: 4,
      icon: "/images/home/services/settings.svg",
      title: "Flexible Scheduling",
      description:
        "Plan your trips according to your schedule with our flexible booking options.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-primary font-garetheavy text-4xl md:text-5xl">
            Why TravlAbhi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 font-poppins">
          {features.map((feature) => (
            <div key={feature.id} className="text-center group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-[18px] text-slate-900 mb-3 font-garet-book">
                {feature.title}
              </h3>

              <ul className="text-slate-600 text-sm leading-6 space-y-0.5">
                <li>lorem ipsum lorem</li>
                <li>ipsum lorem ipsum</li>
                <li>lorem ipsum lorem</li>
                <li>ipsum lorem ipsum</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
