"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import SiteHeader from "@/components/common/SiteHeader";

export default function BookingPage({ tripId }: { tripId: string }) {
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { userProfile, isCustomer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    travelerName: "",
    travelerEmail: "",
    travelerPhone: "",
    groupSize: 1,
    preferences: "",
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.travelerName.trim()) {
      newErrors.travelerName = "Full name is required";
    }

    if (!form.travelerEmail.trim()) {
      newErrors.travelerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.travelerEmail)) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!trip) return;

    try {
      setLoading(true);

      // Create booking with only essential information
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id!,
          travelerName: form.travelerName,
          travelerEmail: form.travelerEmail,
          travelerPhone: form.travelerPhone,
          groupSize: form.groupSize,
          preferences: form.preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
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

        <Card>
          <CardHeader>
            <CardTitle>Booking Request</CardTitle>
          </CardHeader>
          <CardContent>
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
                    className={errors.travelerEmail ? "border-red-500" : ""}
                    required
                  />
                  {errors.travelerEmail && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.travelerEmail}
                    </p>
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
                      const value = Math.max(1, parseInt(e.target.value) || 1);
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
                <div className="text-right text-sm text-gray-700">
                  Estimated total: ₹
                  {(trip.priceInInr * form.groupSize).toLocaleString("en-IN")}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a booking request. The trip
                  organizer will review your request and contact you for payment
                  details and final confirmation.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={tripLoading || loading}>
                  {loading ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
