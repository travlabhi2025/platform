"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TripFormData, calculateDaysBetween } from "@/lib/validations/trip";

interface TripReviewProps {
  formData: TripFormData;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  isEditMode?: boolean;
}

export default function TripReview({
  formData,
  onSubmit,
  onPrev,
  loading,
  isEditMode = false,
}: TripReviewProps) {
  const [showAllItinerary, setShowAllItinerary] = useState(false);
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDuration = () => {
    if (!formData.about.startDate || !formData.about.endDate) {
      return "Not set";
    }
    const days = calculateDaysBetween(
      formData.about.startDate,
      formData.about.endDate
    );
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Review Your Trip</h3>
        <p className="text-gray-600">
          Please review all the details before publishing your trip
        </p>
      </div>

      {/* Trip Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Trip Overview</span>
            <Badge variant="secondary">{formData.about.tripType}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hero Image */}
          {formData.heroImageUrl && (
            <div className="relative w-full h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden rounded-md">
              <Image
                src={formData.heroImageUrl}
                alt={formData.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Gallery Images Preview */}
          {formData.galleryImages && formData.galleryImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Trip Gallery</h4>
              <div className="relative">
                <Carousel
                  className="w-full"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {formData.galleryImages.map((imageUrl, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-2 md:pl-4 basis-full"
                      >
                        <div className="relative w-full h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden rounded-md">
                          <Image
                            src={imageUrl}
                            alt={`${formData.title} - Gallery image ${
                              index + 1
                            }`}
                            fill
                            className="object-cover"
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
              </div>
              <p className="text-sm text-gray-500 text-center">
                {formData.galleryImages.length} gallery image
                {formData.galleryImages.length !== 1 ? "s" : ""} added
              </p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-lg">{formData.title}</h4>
            <p className="text-gray-600">{formData.about.tripType} Trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {formData.about.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {calculateDuration()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-500">₹</span>
              <span className="text-sm font-semibold text-gray-700">
                {formData.priceInInr.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <span className="text-gray-700">Start: </span>
                <span className="text-gray-600">
                  {formatDate(formData.about.startDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <span className="text-gray-700">End: </span>
                <span className="text-gray-600">
                  {formatDate(formData.about.endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              Group size: {formData.about.groupSizeMin} -{" "}
              {formData.about.groupSizeMax} people
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Host Information */}
      <Card>
        <CardHeader>
          <CardTitle>Host Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            {/* Host Image */}
            {formData.host.organizerImage && (
              <div className="flex-shrink-0">
                <Image
                  src={formData.host.organizerImage}
                  alt={`${formData.host.name} - Organizer`}
                  width={64}
                  height={64}
                  className="shrink-0 w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">{formData.host.name}</h4>
              <p className="text-gray-600">{formData.host.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Itinerary Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(showAllItinerary
              ? formData.itinerary
              : formData.itinerary.slice(0, 3)
            ).map((day, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <h5 className="font-medium">
                  Day {day.day}
                  {day.title ? `: ${day.title}` : ""}
                </h5>
                {day.date && (
                  <p className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{day.description}</p>
              </div>
            ))}
            {formData.itinerary.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllItinerary(!showAllItinerary)}
                className="w-full text-primary hover:text-primary/80"
              >
                {showAllItinerary ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show All {formData.itinerary.length} Days
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">
              What&apos;s Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formData.inclusions.map((inclusion, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {inclusion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">
              What&apos;s Not Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formData.exclusions.map((exclusion, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  {exclusion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQs Section */}
      {formData.faqs && formData.faqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border-l-4 border-primary/20 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Q: {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev} disabled={loading}>
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          {loading
            ? isEditMode
              ? "Updating Trip..."
              : "Creating Trip..."
            : isEditMode
            ? "Update Trip"
            : "Create Trip"}
        </Button>
      </div>
    </div>
  );
}
