"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTrip } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import SiteHeader from "@/components/common/SiteHeader";
import { AlertCircle } from "lucide-react";

export default function BookingPage({ tripId }: { tripId: string }) {
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { userProfile, isCustomer, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [existingBooking, setExistingBooking] = useState<{
    id: string;
    status: string;
    bookingDate?: { seconds: number };
    totalAmount?: number;
  } | null>(null);

  const [form, setForm] = useState({
    travelerName: "",
    travelerEmail: "",
    travelerPhone: "",
    groupSize: 1,
    preferences: "",
    packageId: "", // Selected package ID
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill customer information if they're a customer
  useEffect(() => {
    if (isCustomer() && userProfile) {
      setForm((prev) => ({
        ...prev,
        travelerName: userProfile.name || "",
        travelerEmail: userProfile.email || "",
        travelerPhone: userProfile.contact?.phone || "",
      }));
    }
  }, [isCustomer, userProfile]);

  // Auto-select first package if available
  useEffect(() => {
    if (trip && !form.packageId) {
      if (trip.packages && trip.packages.length > 0) {
        setForm((prev) => ({ ...prev, packageId: trip.packages![0].id }));
      }
    }
  }, [trip, form.packageId]);

  // Get selected package details
  const selectedPackage = trip?.packages?.find(
    (pkg) => pkg.id === form.packageId
  );

  // Calculate total amount based on selected package
  const calculateTotal = () => {
    if (!selectedPackage) {
      // Fallback to old format if no packages
      return trip?.priceInInr ? trip.priceInInr * form.groupSize : 0;
    }
    if (selectedPackage.perPerson) {
      return selectedPackage.priceInInr * form.groupSize;
    }
    return selectedPackage.priceInInr;
  };

  // Get user email for display
  const userEmail = userProfile?.email || "";

  // Check for duplicate booking when component loads
  useEffect(() => {
    const checkDuplicateBooking = async () => {
      if (!user || !tripId) return;

      setCheckingDuplicate(true);
      try {
        // Get auth headers with JWT token
        const { getAuthHeaders } = await import("@/lib/auth-helpers");
        const authHeaders = await getAuthHeaders();

        const response = await fetch(`/api/bookings/check?tripId=${tripId}`, {
          headers: authHeaders as HeadersInit,
        });

        if (response.ok) {
          const data = await response.json();
          setHasExistingBooking(data.hasBooked);
          setExistingBooking(data.existingBooking);

          if (data.hasBooked) {
            toast.warning("You have already booked this trip!");
          }
        }
      } catch (error) {
        console.error("Error checking duplicate booking:", error);
      } finally {
        setCheckingDuplicate(false);
      }
    };

    checkDuplicateBooking();
  }, [user, tripId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.travelerName.trim()) {
      newErrors.travelerName = "Full name is required";
    }

    // For authenticated users, use userEmail; for guests, use form.travelerEmail
    const emailToValidate = userEmail || form.travelerEmail;
    if (!emailToValidate.trim()) {
      newErrors.travelerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)) {
      newErrors.travelerEmail = "Please enter a valid email address";
    }

    if (!form.travelerPhone.trim()) {
      newErrors.travelerPhone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.travelerPhone.replace(/\D/g, ""))) {
      newErrors.travelerPhone =
        "Please enter a valid 10-digit Indian phone number";
    }

    if (form.groupSize < 1) {
      newErrors.groupSize = "Group size must be at least 1";
    }

    if (!form.packageId) {
      newErrors.packageId = "Please select a package";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if user is not verified
    if (userProfile && !userProfile.emailVerified) {
      toast.error("Please verify your email address to book a trip.");
      return;
    }

    // Prevent submission if user already has a booking for this trip
    if (hasExistingBooking) {
      toast.error("You have already booked this trip!");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!trip) return;

    try {
      setLoading(true);

      // Get auth headers with JWT token if user is logged in
      let headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (user) {
        const { getAuthHeaders } = await import("@/lib/auth-helpers");
        const authHeaders = await getAuthHeaders();
        headers = { ...headers, ...authHeaders };
      }

      // Create booking with only essential information
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          tripId: trip.id!,
          packageId: form.packageId,
          travelerName: form.travelerName,
          travelerEmail: userEmail || form.travelerEmail, // Use user email if available
          travelerPhone: form.travelerPhone,
          groupSize: form.groupSize,
          preferences: form.preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle organizer booking restriction (403 Forbidden)
        if (
          response.status === 403 &&
          errorData.code === "ORGANIZER_BOOKING_NOT_ALLOWED"
        ) {
          toast.error(
            errorData.error ||
              "Trip organizers cannot book trips. Please use a customer account to make bookings."
          );
          return;
        }

        // Handle duplicate booking error (409 Conflict)
        if (response.status === 409) {
          toast.error(errorData.error || "You have already booked this trip!");

          // If server returns existing booking info, update the state
          if (errorData.existingBooking) {
            setHasExistingBooking(true);
            setExistingBooking(errorData.existingBooking);
          }
          return;
        }

        throw new Error(errorData.error || "Failed to create booking");
      }

      const data = await response.json();

      setBookingId(data.id);
      setBookingSubmitted(true);
      toast.success(
        "Booking request submitted successfully! The trip organizer will review and approve your booking."
      );
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Show success page after booking submission
  if (bookingSubmitted && bookingId) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-16 max-w-4xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="font-garetheavy text-primary text-3xl md:text-4xl mb-4">
              Booking Request Submitted!
            </h1>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for your booking request. The trip organizer will review
              your request and contact you for payment details and final
              confirmation.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-3">
                What happens next?
              </h3>
              <ul className="text-left text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  The organizer will review your booking request
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  We&apos;ll contact you for with payment details
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  Once payment is confirmed, your booking will be approved
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  (window.location.href = `/booking-confirmation/${bookingId}`)
                }
                className="bg-primary text-white"
              >
                Check Booking Status
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-16 max-w-4xl">
        <h1 className="font-garetheavy text-primary text-3xl md:text-4xl mb-2">
          Request Booking
        </h1>
        <div className="text-sm text-gray-600 mb-6">
          Fill out your information to request a booking
        </div>

        {/* Verification Warning */}
        {userProfile && !userProfile.emailVerified && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 font-medium">
                  Email Verification Required
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  You must verify your email address to book a trip. Go to your dashboard to verify.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
                onClick={() => window.location.href = "/dashboard"}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Show existing booking if user has already booked this trip */}
        {hasExistingBooking && existingBooking && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">
                Existing Booking Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-amber-700">
                  You have already booked this trip. Here are the details of
                  your existing booking:
                </p>
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Booking ID:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {existingBooking.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          existingBooking.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : existingBooking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {existingBooking.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Total Amount:
                      </span>
                      <span className="ml-2 text-gray-900">
                        ₹{existingBooking.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Booking Date:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {existingBooking.bookingDate
                          ? new Date(
                              existingBooking.bookingDate.seconds * 1000
                            ).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      (window.location.href = `/booking-confirmation/${existingBooking.id}`)
                    }
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    View Booking Details
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show loading state while checking for duplicates */}
        {checkingDuplicate && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-gray-600">
                  Checking for existing bookings...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Booking Request</CardTitle>
          </CardHeader>
          <CardContent>
            {hasExistingBooking ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  You have already booked this trip. Please check your existing
                  booking details above.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmitBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="travelerName">Full Name *</Label>
                    <Input
                      id="travelerName"
                      value={form.travelerName}
                      onChange={(e) => {
                        setForm({ ...form, travelerName: e.target.value });
                        if (errors.travelerName) {
                          setErrors({ ...errors, travelerName: "" });
                        }
                      }}
                      className={errors.travelerName ? "border-red-500" : ""}
                      required
                    />
                    {errors.travelerName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.travelerName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelerEmail">Email *</Label>
                    {userEmail ? (
                      <>
                        <Input
                          id="travelerEmail"
                          type="email"
                          value={userEmail}
                          disabled
                          className="bg-gray-50 text-gray-600"
                        />
                        <p className="text-sm text-gray-500">
                          Your account email (cannot be changed)
                        </p>
                      </>
                    ) : (
                      <>
                        <Input
                          id="travelerEmail"
                          type="email"
                          value={form.travelerEmail}
                          onChange={(e) => {
                            setForm({ ...form, travelerEmail: e.target.value });
                            if (errors.travelerEmail) {
                              setErrors({ ...errors, travelerEmail: "" });
                            }
                          }}
                          className={
                            errors.travelerEmail ? "border-red-500" : ""
                          }
                          placeholder="Enter your email address"
                          required
                        />
                        {errors.travelerEmail && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.travelerEmail}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="travelerPhone">Phone *</Label>
                    <Input
                      id="travelerPhone"
                      type="tel"
                      value={form.travelerPhone}
                      onChange={(e) => {
                        setForm({ ...form, travelerPhone: e.target.value });
                        if (errors.travelerPhone) {
                          setErrors({ ...errors, travelerPhone: "" });
                        }
                      }}
                      className={errors.travelerPhone ? "border-red-500" : ""}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                    {errors.travelerPhone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.travelerPhone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">Group Size *</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min={1}
                      value={form.groupSize}
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        );
                        setForm({ ...form, groupSize: value });
                        if (errors.groupSize) {
                          setErrors({ ...errors, groupSize: "" });
                        }
                      }}
                      className={errors.groupSize ? "border-red-500" : ""}
                    />
                    {errors.groupSize && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.groupSize}
                      </p>
                    )}
                  </div>
                </div>

                {/* Package Selection */}
                {trip && (trip.packages?.length || 0) > 0 && (
                  <div className="space-y-3">
                    <Label>Select Package *</Label>
                    <RadioGroup
                      value={form.packageId || ""}
                      onValueChange={(value) => {
                        setForm({ ...form, packageId: value });
                        // Clear any package selection errors
                        if (errors.packageId) {
                          setErrors({ ...errors, packageId: "" });
                        }
                      }}
                      className="space-y-3"
                    >
                      {trip.packages!.map((pkg) => (
                        <label
                          key={pkg.id}
                          htmlFor={`package-${pkg.id}`}
                          className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            form.packageId === pkg.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem
                            value={pkg.id}
                            id={`package-${pkg.id}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-base cursor-pointer">
                              {pkg.name}
                            </div>
                            {pkg.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {pkg.description}
                              </p>
                            )}
                            {pkg.features && pkg.features.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                  Includes:
                                </p>
                                <ul className="space-y-1">
                                  {pkg.features.map((feature, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-gray-500 flex items-center gap-1"
                                    >
                                      <span className="text-primary">•</span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mt-2">
                              <span className="text-lg font-bold text-primary">
                                ₹{pkg.priceInInr.toLocaleString("en-IN")}
                              </span>
                              {pkg.perPerson && (
                                <span className="text-sm text-gray-600 ml-1">
                                  per person
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                    {errors.packageId && (
                      <p className="text-sm text-red-500">{errors.packageId}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="preferences">Preferences (Optional)</Label>
                  <Textarea
                    id="preferences"
                    rows={3}
                    value={form.preferences}
                    onChange={(e) =>
                      setForm({ ...form, preferences: e.target.value })
                    }
                  />
                </div>

                {trip && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Total</p>
                        <p className="text-xs text-gray-500">
                          For {form.groupSize}{" "}
                          {form.groupSize === 1 ? "person" : "people"}
                          {selectedPackage && ` - ${selectedPackage.name}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ₹{calculateTotal().toLocaleString("en-IN")}
                        </div>
                        {selectedPackage ? (
                          <div className="text-sm text-gray-600">
                            {selectedPackage.perPerson
                              ? `₹${selectedPackage.priceInInr.toLocaleString("en-IN")} per person`
                              : "Total price"}
                          </div>
                        ) : trip.priceInInr ? (
                          <div className="text-sm text-gray-600">
                            ₹{trip.priceInInr.toLocaleString("en-IN")} per person
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> This is a booking request. The trip
                    organizer will review your request and contact you for
                    payment details and final confirmation.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={Boolean(tripLoading || loading || (userProfile && !userProfile.emailVerified))}>
                    {loading ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
