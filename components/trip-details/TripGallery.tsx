"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TripGalleryProps {
  images: string[];
  title: string;
}

export default function TripGallery({ images, title }: TripGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1 || !api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, api]);

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) return;

    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="font-garetheavy text-slate-900 text-xl mb-4">
        Trip Gallery
      </h2>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                <div className="relative w-full h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden rounded-md">
                  <Image
                    src={image}
                    alt={`${title} - Gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0">
            <ChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0">
            <ChevronRight className="h-4 w-4" />
          </CarouselNext>
        </Carousel>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (api) {
                    api.scrollTo(index);
                    setIsAutoPlaying(false);
                    // Resume auto-play after 2 seconds
                    setTimeout(() => setIsAutoPlaying(true), 2000);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play indicator */}
        {images.length > 1 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isAutoPlaying ? "Auto-playing" : "Paused"} - Click to{" "}
              {isAutoPlaying ? "pause" : "resume"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
