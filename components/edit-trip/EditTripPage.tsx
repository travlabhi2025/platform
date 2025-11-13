"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useTrip } from "@/lib/hooks";
import { tripFormSchema, TripFormData, mergeItineraryWithNewDates, calculateDaysBetween } from "@/lib/validations/trip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
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
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(
    new Set()
  );
  const [showDateChangeWarning, setShowDateChangeWarning] = useState(false);
  const [pendingDateUpdate, setPendingDateUpdate] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const originalDatesRef = useRef<{ startDate: string; endDate: string } | null>(null);
  const originalItineraryRef = useRef<Array<{ day: number; title?: string; description?: string; date?: string }> | null>(null);
  const { trip, loading: tripLoading, error: tripError } = useTrip(tripId);
  const { user } = useAuth();
  const router = useRouter();

  const progress = (currentStep / steps.length) * 100;

  // Helper function to format date as DD/MM/YYYY
  const formatDateDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Initialize form data when trip is loaded
  useEffect(() => {
    if (trip) {
      console.log("EditTripPage - Loaded trip data:", trip);
      // Migrate old format to packages if needed
      const migratedTrip = { ...trip };
      if (!migratedTrip.packages || migratedTrip.packages.length === 0) {
        if (migratedTrip.priceInInr) {
          migratedTrip.packages = [
            {
              id: `package-${trip.id || Date.now()}`,
              name: "Standard Package",
              description: "",
              priceInInr: migratedTrip.priceInInr,
              currency: migratedTrip.currency || "INR",
              perPerson: migratedTrip.perPerson ?? true,
              features: [],
            },
          ];
        } else {
          // Ensure at least one empty package
          migratedTrip.packages = [
            {
              id: `package-${Date.now()}`,
              name: "",
              description: "",
              priceInInr: 0,
              currency: "INR",
              perPerson: true,
              features: [],
            },
          ];
        }
      }
      // Ensure packages is always defined before setting form data
      const tripWithPackages = {
        ...migratedTrip,
        packages: migratedTrip.packages || [],
      };
      setFormData(tripWithPackages);
      
      // Store original dates and itinerary for comparison and restoration
      if (tripWithPackages.about?.startDate && tripWithPackages.about?.endDate) {
        originalDatesRef.current = {
          startDate: tripWithPackages.about.startDate,
          endDate: tripWithPackages.about.endDate,
        };
      }
      
      // Store original itinerary - deep copy to preserve it
      if (tripWithPackages.itinerary && tripWithPackages.itinerary.length > 0) {
        originalItineraryRef.current = tripWithPackages.itinerary.map((day: { day: number; title?: string; description?: string; date?: string }) => ({
          day: day.day,
          title: day.title || "",
          description: day.description || "",
          date: day.date || "",
        }));
      } else {
        originalItineraryRef.current = [];
      }
    }
  }, [trip]);

  // Check if user is authorized to edit this trip
  useEffect(() => {
    if (trip && user && trip.createdBy !== user.uid) {
      router.push("/unauthorized");
    }
  }, [trip, user, router]);


  const updateFormData = (updates: Partial<TripFormData>) => {
    if (!formData) return;

    // Check if dates are being changed (compare with current formData dates)
    const currentStartDate = formData.about.startDate;
    const currentEndDate = formData.about.endDate;
    const newStartDate = updates.about?.startDate !== undefined 
      ? updates.about.startDate 
      : currentStartDate;
    const newEndDate = updates.about?.endDate !== undefined 
      ? updates.about.endDate 
      : currentEndDate;

    // Show warning if dates are changing from their current values
    const dateChanged =
      (updates.about?.startDate !== undefined &&
        newStartDate !== currentStartDate) ||
      (updates.about?.endDate !== undefined &&
        newEndDate !== currentEndDate);

    // Show warning modal for any date change (user can change dates multiple times)
    if (dateChanged && newStartDate && newEndDate) {
      // Store pending update and show warning
      setPendingDateUpdate({
        startDate: newStartDate,
        endDate: newEndDate,
      });
      setShowDateChangeWarning(true);
      // Temporarily update the dates in formData so DatePicker shows the new value
      // If user cancels, we'll revert dates and itinerary in handleDateChangeCancel
      setFormData({
        ...formData,
        about: {
          ...formData.about,
          ...updates.about,
        },
      });
      return; // Don't apply other updates yet, wait for user confirmation
    }

    // Normal update (no date change or already confirmed)
    setFormData({ ...formData, ...updates });
  };

  const handleDateChangeConfirm = () => {
    if (!formData || !pendingDateUpdate) return;

    const newStartDate = pendingDateUpdate.startDate;
    const newEndDate = pendingDateUpdate.endDate;

    // Calculate expected days
    const expectedDays = calculateDaysBetween(newStartDate, newEndDate);
    
    // Use current itinerary (which may have been edited) to merge with new dates
    // This preserves any edits the user made to the itinerary
    const currentItinerary = formData.itinerary;
    
    // Merge itinerary with new dates, preserving existing data
    const mergedItinerary = mergeItineraryWithNewDates(
      currentItinerary,
      newStartDate,
      newEndDate
    );
    
    console.log("Date change confirm:", {
      oldItineraryLength: currentItinerary.length,
      mergedItineraryLength: mergedItinerary.length,
      expectedDays,
      newStartDate,
      newEndDate,
      originalItineraryLength: originalItineraryRef.current?.length,
    });
    
    // Ensure itinerary matches the date range exactly
    let finalItinerary = mergedItinerary;
    if (mergedItinerary.length !== expectedDays) {
      console.warn(`Itinerary length mismatch: ${mergedItinerary.length} vs ${expectedDays}, regenerating...`);
      finalItinerary = mergeItineraryWithNewDates(
        currentItinerary,
        newStartDate,
        newEndDate
      );
    }

    // Create completely new object references to force React to detect the change
    const updatedAbout = {
      ...formData.about,
      startDate: newStartDate,
      endDate: newEndDate,
    };

    // Create a new array with new object references for each day
    // IMPORTANT: Preserve the date field from finalItinerary which has the updated dates
    const updatedItinerary = finalItinerary.map((day) => {
      const result = {
        day: day.day,
        title: day.title || "",
        description: day.description || "",
        date: day.date || "", // This should have the new date from mergeItineraryWithNewDates
      };
      console.log(`Mapping day ${day.day}:`, { oldDate: day.date, resultDate: result.date });
      return result;
    });
    
    console.log("Updated itinerary dates:", updatedItinerary.map(d => ({ day: d.day, date: d.date })));

    // Create completely new formData object
    const updatedFormData: TripFormData = {
      ...formData,
      about: updatedAbout,
      itinerary: updatedItinerary,
    };

    // Update state - this should trigger a re-render
    setFormData(updatedFormData);

    // Update original dates ref (but keep original itinerary ref unchanged)
    // The original itinerary is preserved until the trip is saved
    originalDatesRef.current = {
      startDate: newStartDate,
      endDate: newEndDate,
    };

    // Close modal and clear pending update
    setShowDateChangeWarning(false);
    setPendingDateUpdate(null);

    // Use setTimeout to ensure state has updated before showing toast
    setTimeout(() => {
      toast.success(
        `Dates updated. Itinerary now has ${updatedItinerary.length} days. Your original itinerary is preserved until you save.`
      );
    }, 100);
  };

  const handleDateChangeCancel = () => {
    // Revert dates and itinerary to original values (from when trip was first loaded)
    // This ensures users can always go back to their original itinerary
    if (formData && originalDatesRef.current && originalItineraryRef.current !== null) {
      // Restore original itinerary - deep copy to create new references
      const restoredItinerary = originalItineraryRef.current.map((day) => ({
        day: day.day,
        title: day.title || "",
        description: day.description || "",
        date: day.date || "",
      }));

      setFormData({
        ...formData,
        about: {
          ...formData.about,
          startDate: originalDatesRef.current.startDate,
          endDate: originalDatesRef.current.endDate,
        },
        // Restore original itinerary - this preserves all original data
        itinerary: restoredItinerary,
      });
      
      console.log("Date change cancelled - restored original itinerary:", {
        originalLength: originalItineraryRef.current.length,
        restoredLength: restoredItinerary.length,
      });
    }
    setShowDateChangeWarning(false);
    setPendingDateUpdate(null);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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

      // At this point, the formData contains the current state (which may have been modified)
      // The original itinerary is preserved in originalItineraryRef but we use current formData
      // This ensures that any edits (including date changes and itinerary updates) are saved
      
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

      // Only after successful save, we can consider the changes committed
      // The original itinerary ref can remain as a backup until next load
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
            key={`itinerary-${formData.itinerary.length}-${formData.about.startDate}-${formData.about.endDate}`}
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
            isEditMode={true}
          />
        );
      default:
        return null;
    }
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        {/* Progress Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Skeleton className="h-2 w-full mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Form Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Textarea Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex justify-end gap-4 pt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
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

      {/* Date Change Warning Modal */}
      <AlertDialog
        open={showDateChangeWarning}
        onOpenChange={(open) => {
          if (!open) {
            handleDateChangeCancel();
          } else {
            setShowDateChangeWarning(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <AlertDialogTitle>Date Change Warning</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <div className="pt-4">
            <AlertDialogDescription className="mb-3">
              Changing the trip dates will affect your itinerary. The system will attempt to preserve your existing itinerary data, but you should review and update it in the Itinerary step.
            </AlertDialogDescription>
            {pendingDateUpdate && originalDatesRef.current && (
              <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Original Dates:</span>
                  <span className="text-gray-600">
                    {formatDateDDMMYYYY(originalDatesRef.current.startDate)} - {formatDateDDMMYYYY(originalDatesRef.current.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">New Dates:</span>
                  <span className="text-gray-600">
                    {formatDateDDMMYYYY(pendingDateUpdate.startDate)} - {formatDateDDMMYYYY(pendingDateUpdate.endDate)}
                  </span>
                </div>
              </div>
            )}
            <p className="mt-4 font-medium text-gray-900">
              Do you want to proceed with updating the dates?
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDateChangeCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDateChangeConfirm}
              className="bg-primary hover:bg-primary/90"
            >
              Yes, Update Dates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
