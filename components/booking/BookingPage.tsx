"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/common/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTrip, useCreateBooking } from "@/lib/hooks";
import { toast } from "sonner";

export default function BookingPage({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { createBooking, loading } = useCreateBooking();

  const [form, setForm] = useState({
    travelerName: "",
    travelerEmail: "",
    travelerPhone: "",
    groupSize: 1,
    preferences: "",
  });

  const [step, setStep] = useState<1 | 2>(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingBooking, setExistingBooking] = useState<{
    id: string;
    status: string;
    bookingDate: { seconds: number } | string;
    totalAmount: number;
  } | null>(null);
  const [checkingBooking, setCheckingBooking] = useState(true);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      travelerName: f.travelerName || user.displayName || "",
      travelerEmail: f.travelerEmail || user.email || "",
    }));
  }, [user]);

  // Check for existing booking
  useEffect(() => {
    const checkExistingBooking = async () => {
      if (!user?.uid || !tripId) return;

      try {
        setCheckingBooking(true);
        const response = await fetch(
          `/api/bookings/check?userId=${user.uid}&tripId=${tripId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.hasBooked) {
            setExistingBooking(data.existingBooking);
          }
        }
      } catch (error) {
        console.error("Error checking existing booking:", error);
      } finally {
        setCheckingBooking(false);
      }
    };

    checkExistingBooking();
  }, [user?.uid, tripId]);

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

    if (form.groupSize < 1) {
      newErrors.groupSize = "Group size must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    setStep(2);
  };

  const onPayNow = async () => {
    if (!trip) return;
    try {
      const id = await createBooking({
        tripId: trip.id!,
        travelerName: form.travelerName,
        travelerEmail: form.travelerEmail,
        travelerPhone: form.travelerPhone,
        groupSize: form.groupSize,
        preferences: form.preferences,
        status: "Pending",
        totalAmount: trip.priceInInr * form.groupSize,
        paymentStatus: "Pending",
      });
      toast.success("Payment received and booking created");
      window.location.href = `/dashboard/bookings/${id}`;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create booking");
    }
  };

  // Show loading state while checking for existing bookings
  if (checkingBooking) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Checking booking status...</div>
          </div>
        </main>
      </div>
    );
  }

  // Show existing booking information if user has already booked
  if (existingBooking) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
          <h1 className="font-garetheavy text-primary text-3xl md:text-4xl mb-6">
            Booking Status
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>Existing Booking Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">
                  You have already booked this trip!
                </p>
                <p className="text-blue-600 text-sm mb-4">
                  Only one booking per trip is allowed. Here are your booking
                  details:
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div className="flex justify-between">
                    <span className="font-medium">Booking Date:</span>
                    <span>
                      {(() => {
                        try {
                          // Handle Firestore Timestamp
                          if (
                            typeof existingBooking.bookingDate === "object" &&
                            existingBooking.bookingDate.seconds
                          ) {
                            return new Date(
                              existingBooking.bookingDate.seconds * 1000
                            ).toLocaleDateString();
                          }
                          // Handle regular Date string
                          return new Date(
                            existingBooking.bookingDate as string
                          ).toLocaleDateString();
                        } catch {
                          return "Invalid Date";
                        }
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span>₹{existingBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => (window.location.href = "/dashboard#bookings")}
                  className="bg-primary text-white"
                >
                  View All Bookings
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 max-w-4xl">
        <h1 className="font-garetheavy text-primary text-3xl md:text-4xl mb-2">
          Book Trip
        </h1>
        <div className="text-sm text-gray-600 mb-6">
          Step {step} of 2 · {step === 1 ? "Information" : "Payment"}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === 1 ? "Booking Details" : "Payment"}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={onSubmitInfo} className="space-y-6">
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
                    <Label htmlFor="travelerPhone">Phone</Label>
                    <Input
                      id="travelerPhone"
                      value={form.travelerPhone}
                      onChange={(e) =>
                        setForm({ ...form, travelerPhone: e.target.value })
                      }
                    />
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
                    Total amount: ₹
                    {(trip.priceInInr * form.groupSize).toLocaleString("en-IN")}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={tripLoading}>
                    Continue to payment
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Payable amount
                  </div>
                  <div className="text-2xl font-semibold">
                    ₹
                    {trip
                      ? (trip.priceInInr * form.groupSize).toLocaleString(
                          "en-IN"
                        )
                      : "-"}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="border rounded-md p-4 h-[220px] flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                      QR Code Placeholder
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>Dummy UPI: travel@upi</div>
                    <div>Reference will be auto-verified (placeholder).</div>
                    <div className="pt-2">
                      <Button onClick={onPayNow} disabled={loading}>
                        {loading ? "Processing..." : "Pay now"}
                      </Button>
                    </div>
                    <div>
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
