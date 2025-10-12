import Image from "next/image";
import Link from "next/link";

export default function TopDestinations() {
  const destinations = [
    {
      id: 1,
      image: "/images/home/top-destinations/Rectangle-3.png",
      title: "Rome, Italy",
      price: "₹2,00,000/pax",
      duration: "10 Days Trip",
    },
    {
      id: 2,
      image: "/images/home/top-destinations/Rectangle-2.png",
      title: "London, UK",
      price: "₹3,20,000/pax",
      duration: "12 Days Trip",
    },
    {
      id: 3,
      image: "/images/home/top-destinations/Rectangle-1.png",
      title: "Full Europe",
      price: "₹12,00,000/pax",
      duration: "28 Days Trip",
    },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-6xl text-center text-white mb-20 font-garetheavy">
          Top Destinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href="/"
              className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
            >
              <div className="relative h-96">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="px-6 py-5 font-poppins">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[16px] md:text-[17px] font-normal text-slate-700 tracking-tight">
                    {destination.title}
                  </h3>
                  <span className="text-[16px] md:text-[17px] font-medium text-slate-700 whitespace-nowrap">
                    {destination.price}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-slate-600">
                  <Image
                    src="/icons/Navigation.svg"
                    alt="navigation"
                    width={18}
                    height={18}
                  />
                  <span className="text-[13px] md:text-[14px] font-light">
                    {destination.duration}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
