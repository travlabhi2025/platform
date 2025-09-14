import Image from "next/image";

export default function BookingSteps() {
  const steps = [
    {
      icon: "/images/home/easy-steps/curated-trips.svg",
      title: "Browse Curated Trips",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
    },
    {
      icon: "/images/home/easy-steps/comunity-based.svg",
      title: "Join Community-Based Groups",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
    },
    {
      icon: "/images/home/easy-steps/travel-share.svg",
      title: "Travel & Share Your Story",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
    },
  ];

  return (
    <section className="py-20 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Steps */}
          <div className="font-poppins">
            <p className="text-primary font-medium mb-4">Easy and Fast</p>
            <h2 className="text-4xl md:text-5xl text-primary mb-10 font-garetheavy leading-[1.1]">
              Book Your Next Trip In 3 Easy Steps
            </h2>

            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Image src={step.icon} alt="" width={47} height={48} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Trip Card */}
          <div className="relative max-w-xl lg:max-w-none mx-auto">
            <div className="relative">
              <Image
                src="/images/home/easy-steps/easysteps-img.png"
                alt="Easy steps illustration"
                className="object-contain scale-110"
                priority
                width={650}
                height={650}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
