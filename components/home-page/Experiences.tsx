import Image from "next/image";

export default function Experiences() {
  const images = [
    "/images/home/experiences/exp-0.png",
    "/images/home/experiences/exp-1.png",
    "/images/home/experiences/exp-2.png",
    "/images/home/experiences/exp-3.png",
    "/images/home/experiences/exp-4.png",
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl text-primary font-garetheavy mb-16">
          Experiences that changed lives
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {images.map((src) => (
            <div
              key={src}
              className="rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={src}
                  alt="experience"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
