"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useTrip } from "@/lib/hooks";
import { tripFormSchema, TripFormData } from "@/lib/validations/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TripBasicInfo from "../create-trip/TripBasicInfo";
import TripDetails from "../create-trip/TripDetails";
import TripItinerary from "../create-trip/TripItinerary";
import TripGallery from "../create-trip/TripGallery";
import TripFAQs from "../create-trip/TripFAQs";
import TripReview from "../create-trip/TripReview";

const steps = [
  {
    id: 1,
    title: "Basic Info",
    description: "Trip title, price, and basic details",
  },
  {
    id: 2,
    title: "Trip Details",
    description: "Location, dates, and trip specifics",
  },
  { id: 3, title: "Itinerary", description: "Daily activities and inclusions" },
  { id: 4, title: "Gallery", description: "Additional trip images" },
  { id: 5, title: "FAQs", description: "Frequently asked questions" },
  { id: 6, title: "Review", description: "Review and update your trip" },
];

interface EditTripPageProps {
  tripId: string;
}

export default function EditTripPage({ tripId }: EditTripPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trip, loading: tripLoading, error: tripError } = useTrip(tripId);
  const { user } = useAuth();
  const router = useRouter();

  const progress = (currentStep / steps.length) * 100;

  // Initialize form data when trip is loaded
  useEffect(() => {
    if (trip) {
      console.log("EditTripPage - Loaded trip data:", trip);
      setFormData(trip);
    }
  }, [trip]);

  // Check if user is authorized to edit this trip
  useEffect(() => {
    if (trip && user && trip.createdBy !== user.uid) {
      router.push("/unauthorized");
    }
  }, [trip, user, router]);

  const updateFormData = (updates: Partial<TripFormData>) => {
    if (formData) {
      setFormData({ ...formData, ...updates });
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    if (!formData) return false;

    setErrors({});

    if (step === 1) {
      if (!formData.title) {
        setErrors({ title: "Trip title is required" });
        return false;
      }
      if (!formData.heroImageUrl) {
        setErrors({ heroImageUrl: "Hero image is required" });
        return false;
      }
      if (formData.priceInInr <= 0) {
        setErrors({ priceInInr: "Price must be greater than 0" });
        return false;
      }
    } else if (step === 2) {
      if (!formData.about.location) {
        setErrors({ location: "Location is required" });
        return false;
      }
      if (!formData.about.startDate) {
        setErrors({ startDate: "Start date is required" });
        return false;
      }
      if (!formData.about.endDate) {
        setErrors({ endDate: "End date is required" });
        return false;
      }
      if (
        new Date(formData.about.endDate) < new Date(formData.about.startDate)
      ) {
        setErrors({ endDate: "End date cannot be before start date" });
        return false;
      }
      if (!formData.about.tripType) {
        setErrors({ tripType: "Trip type is required" });
        return false;
      }
      if (!formData.host.name) {
        setErrors({ hostName: "Host name is required" });
        return false;
      }
      if (!formData.host.description || formData.host.description.length < 10) {
        setErrors({
          hostDescription: "Host description must be at least 10 characters",
        });
        return false;
      }
    } else if (step === 3) {
      if (formData.itinerary.length === 0) {
        setErrors({ itinerary: "At least one itinerary day is required" });
        return false;
      }
      if (formData.inclusions.length === 0) {
        setErrors({ inclusions: "At least one inclusion is required" });
        return false;
      }
      if (formData.exclusions.length === 0) {
        setErrors({ exclusions: "At least one exclusion is required" });
        return false;
      }
    } else if (step === 4) {
      // Gallery step - no validation required, gallery images are optional
      return true;
    } else if (step === 5) {
      // FAQs step - no validation required, FAQs are optional
      return true;
    } else if (step === 6) {
      // Final validation - comprehensive check of all required fields
      const validationErrors: Record<string, string> = {};

      // Step 1 validations
      if (!formData.title) {
        validationErrors.title = "Trip title is required";
      }
      if (!formData.heroImageUrl) {
        validationErrors.heroImageUrl = "Hero image is required";
      }
      if (formData.priceInInr <= 0) {
        validationErrors.priceInInr = "Price must be greater than 0";
      }

      // Step 2 validations
      if (!formData.about.location) {
        validationErrors.location = "Location is required";
      }
      if (!formData.about.startDate) {
        validationErrors.startDate = "Start date is required";
      }
      if (!formData.about.endDate) {
        validationErrors.endDate = "End date is required";
      }
      if (
        formData.about.startDate &&
        formData.about.endDate &&
        new Date(formData.about.endDate) < new Date(formData.about.startDate)
      ) {
        validationErrors.endDate = "End date cannot be before start date";
      }
      if (!formData.about.tripType) {
        validationErrors.tripType = "Trip type is required";
      }
      if (!formData.host.name) {
        validationErrors.hostName = "Host name is required";
      }
      if (!formData.host.description || formData.host.description.length < 10) {
        validationErrors.hostDescription =
          "Host description must be at least 10 characters";
      }

      // Step 3 validations
      if (formData.itinerary.length === 0) {
        validationErrors.itinerary = "At least one itinerary day is required";
      }
      if (formData.inclusions.length === 0) {
        validationErrors.inclusions = "At least one inclusion is required";
      }
      if (formData.exclusions.length === 0) {
        validationErrors.exclusions = "At least one exclusion is required";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!formData || !user) return;

    try {
      setLoading(true);

      // Final validation
      if (!validateStep(5)) {
        toast.error("Please fix the validation errors before submitting");
        return;
      }

      // Validate with Zod schema
      const validatedData = tripFormSchema.parse(formData);

      // Get auth headers with JWT token
      const { getAuthHeaders } = await import("@/lib/auth-helpers");
      const authHeaders = await getAuthHeaders();

      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update trip");
      }

      toast.success("Trip updated successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).name === "ZodError") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error("Zod validation errors:", (error as any).errors);
        // Show specific validation errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessages = (error as any).errors
          .map((err: { path: string[]; message: string }) => {
            const path = err.path.length > 0 ? err.path.join(".") : "form";
            return `${path}: ${err.message}`;
          })
          .join(", ");
        toast.error(`Please fix these errors: ${errorMessages}`);
      } else {
        console.error("Submit error:", error);
        toast.error(
          (error as Error).message ||
            "An error occurred while updating the trip"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (!formData) return null;

    switch (currentStep) {
      case 1:
        return (
          <TripBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            errors={errors}
          />
        );
      case 2:
        return (
          <TripDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            errors={errors}
          />
        );
      case 3:
        return (
          <TripItinerary
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            errors={errors}
          />
        );
      case 4:
        return (
          <TripGallery
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            errors={errors}
          />
        );
      case 5:
        return (
          <TripFAQs
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            errors={errors}
          />
        );
      case 6:
        return (
          <TripReview
            formData={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            loading={loading}
            isEditMode={true}
          />
        );
      default:
        return null;
    }
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading trip data...</div>
      </div>
    );
  }

  if (tripError || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">
          Error loading trip: {tripError || "Trip not found"}
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Preparing trip data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Trip</h1>
          <p className="text-gray-600">Update your trip details</p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`text-center transition-all duration-300 ease-in-out ${
                      isCompleted
                        ? "text-primary font-medium scale-95"
                        : isActive
                        ? "text-primary font-bold "
                        : "text-gray-400 scale-95"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto mb-1 rounded-full border-2 flex items-center justify-center text-xs transition-all duration-300 ease-in-out ${
                        isCompleted
                          ? "bg-primary border-primary text-white scale-95"
                          : isActive
                          ? "bg-primary/10 border-primary text-primary  shadow-lg"
                          : "bg-gray-50 border-gray-300 text-gray-400 scale-95"
                      }`}
                    >
                      {isCompleted ? "✓" : step.id}
                    </div>
                    <div
                      className={`font-medium transition-all duration-300 ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-primary/80"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs hidden sm:block transition-all duration-300 ${
                        isActive
                          ? "text-primary/70"
                          : isCompleted
                          ? "text-primary/60"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">Step {currentStep}</span>
              <span className="text-gray-600">
                - {steps[currentStep - 1].title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
