"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  tripFormSchema,
  TripFormData,
  generateItineraryDays,
} from "@/lib/validations/trip";
import TripBasicInfo from "./TripBasicInfo";
import TripDetails from "./TripDetails";
import TripItinerary from "./TripItinerary";
import TripGallery from "./TripGallery";
import TripFAQs from "./TripFAQs";
import TripReview from "./TripReview";

const initialFormData: TripFormData = {
  title: "",
  heroImageUrl: "",
  galleryImages: [],
  packages: [
    {
      id: `package-${Date.now()}`,
      name: "",
      description: "",
      priceInInr: 0,
      currency: "INR",
      perPerson: true,
      features: [],
    },
  ],
  about: {
    tripName: "",
    location: "",
    startDate: "",
    endDate: "",
    groupSizeMin: 1,
    groupSizeMax: 10,
    ageMin: 18,
    ageMax: 65,
    tripTypes: [],
  },
  host: {
    name: "",
    rating: 5,
    reviewsCount: 0,
    description: "",
    organizerImage: "",
  },
  itinerary: [],
  inclusions: [],
  exclusions: [],
  reviewsSummary: {
    average: 5,
    totalCount: 0,
    distribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
  },
  reviews: [],
  faqs: [],
  relatedTrips: [],
  status: "Upcoming",
};

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
  { id: 6, title: "Review", description: "Review and publish your trip" },
];

export default function CreateTripPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(
    new Set()
  );
  const { user } = useAuth();
  const router = useRouter();

  const progress = (currentStep / steps.length) * 100;

  const updateFormData = (updates: Partial<TripFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };

      // Auto-generate itinerary when dates change
      if (updates.about?.startDate || updates.about?.endDate) {
        const startDate = newData.about.startDate;
        const endDate = newData.about.endDate;

        if (startDate && endDate) {
          newData.itinerary = generateItineraryDays(startDate, endDate);
        }
      }

      return newData;
    });

    // Clear errors when data changes
    setErrors({});
  };

  const handleUploadStart = (index: number) => {
    setUploadingIndexes((prev) => new Set(prev).add(index));
  };

  const handleUploadEnd = (index: number) => {
    setUploadingIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    try {
      // Validate the current step's required fields
      if (step === 1) {
        if (!formData.title) {
          setErrors({ title: "Trip title is required" });
          return false;
        }
        if (!formData.heroImageUrl) {
          setErrors({ heroImageUrl: "Hero image is required" });
          return false;
        }
        // Validate packages
        if (!formData.packages || formData.packages.length === 0) {
          setErrors({ packages: "At least one package is required" });
          return false;
        }
        // Validate each package
        for (let i = 0; i < formData.packages.length; i++) {
          const pkg = formData.packages[i];
          if (!pkg.name || pkg.name.trim() === "") {
            setErrors({ packages: `Package ${i + 1} name is required` });
            return false;
          }
          if (!pkg.priceInInr || pkg.priceInInr <= 0) {
            setErrors({ packages: `Package ${i + 1} price must be greater than 0` });
            return false;
          }
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
        if (!formData.about.tripTypes || formData.about.tripTypes.length === 0) {
          setErrors({ tripTypes: "Select at least one trip type" });
          return false;
        }
        if (!formData.host.name) {
          setErrors({ hostName: "Host name is required" });
          return false;
        }
        if (
          !formData.host.description ||
          formData.host.description.length < 10
        ) {
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
        // Gallery step - check for empty image cards
        const hasEmptyImages = (formData.galleryImages || []).some(
          (url) => !url
        );
        const hasUploadingImages = uploadingIndexes.size > 0;

        if (hasEmptyImages) {
          setErrors({
            galleryImages:
              "Please upload all images or remove empty image cards before proceeding",
          });
          return false;
        }

        if (hasUploadingImages) {
          setErrors({
            galleryImages: "Please wait for all images to finish uploading",
          });
          return false;
        }

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
        // Validate packages
        if (!formData.packages || formData.packages.length === 0) {
          validationErrors.packages = "At least one package is required";
        } else {
          // Validate each package
          for (let i = 0; i < formData.packages.length; i++) {
            const pkg = formData.packages[i];
            if (!pkg.name || pkg.name.trim() === "") {
              validationErrors.packages = `Package ${i + 1} name is required`;
              break;
            }
            if (!pkg.priceInInr || pkg.priceInInr <= 0) {
              validationErrors.packages = `Package ${i + 1} price must be greater than 0`;
              break;
            }
          }
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
        if (!formData.about.tripTypes || formData.about.tripTypes.length === 0) {
          validationErrors.tripTypes = "Select at least one trip type";
        }
        if (!formData.host.name) {
          validationErrors.hostName = "Host name is required";
        }
        if (
          !formData.host.description ||
          formData.host.description.length < 10
        ) {
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

      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to create a trip");
      return;
    }

    // Final validation
    if (!validateStep(4)) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      // Validate with Zod schema
      const validatedData = tripFormSchema.parse({
        ...formData,
        about: {
          ...formData.about,
          tripName: formData.title, // Use title as tripName
        },
      });

      // Get auth headers with JWT token
      const { getAuthHeaders } = await import("@/lib/auth-helpers");
      const authHeaders = await getAuthHeaders();

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create trip");
      }

      toast.success("Trip created successfully!");
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
            "An error occurred while creating the trip"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
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
            uploadingIndexes={uploadingIndexes}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
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
          />
        );
      default:
        return null;
    }
  };

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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Trip
          </h1>
          <p className="text-gray-600">
            Share your amazing travel experiences with others
          </p>
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

