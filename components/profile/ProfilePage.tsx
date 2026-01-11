"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Earth } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MaterialSymbolsLoader from "@/components/MaterialSymbolsLoader";
import PhoneInput from "@/components/auth/PhoneInput";
import { useAuth } from "@/lib/auth-context";
import { useMyBookings } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const { bookings: myBookings } = useMyBookings();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Key to force PhoneInput remount
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "",
    phoneNumber: "", // Store phone number separately
    email: "",
  });

  // Initialize form data
  useEffect(() => {
    if (userProfile || user) {
      const countryCode = userProfile?.contact?.countryCode || "";
      const phoneNumber = userProfile?.contact?.phone || "";
      // Combine for PhoneInput component
      const fullPhone =
        countryCode && phoneNumber
          ? `${countryCode} ${phoneNumber}`
          : phoneNumber || "";

      setFormData({
        name: userProfile?.name || user?.displayName || "",
        phone: fullPhone,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        email: userProfile?.contact?.email || user?.email || "",
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { getAuthHeaders } = await import("@/lib/auth-helpers");
      const authHeaders = await getAuthHeaders();

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            contact: {
              email: formData.email,
              phone:
                formData.phoneNumber ||
                (() => {
                  // Fallback: properly parse phone number from full value
                  const match = formData.phone.match(/^(\+\d+)\s*(.+)$/);
                  if (match) {
                    return match[2].replace(/\D/g, ""); // Remove non-digits from phone part only
                  }
                  return formData.phone.replace(/\D/g, ""); // If no country code found, return all digits
                })(),
              countryCode:
                formData.countryCode ||
                formData.phone.match(/^(\+\d+)/)?.[1] ||
                "",
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload();
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      toast.error(
        (error as unknown as { message: string }).message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (userProfile || user) {
      const countryCode = userProfile?.contact?.countryCode || "";
      const phoneNumber = userProfile?.contact?.phone || "";
      const fullPhone =
        countryCode && phoneNumber
          ? `${countryCode} ${phoneNumber}`
          : phoneNumber || "";

      setFormData({
        name: userProfile?.name || user?.displayName || "",
        phone: fullPhone,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        email: userProfile?.contact?.email || user?.email || "",
      });
    }
    setIsEditing(false);
    setFormKey((prev) => prev + 1); // Force PhoneInput to remount
  };

  const handlePhoneChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  }, []);

  const handlePhoneChangeWithParts = useCallback(
    (parts: {
      countryCode: string;
      phoneNumber: string;
      fullValue: string;
    }) => {
      setFormData((prev) => ({
        ...prev,
        phone: parts.fullValue,
        countryCode: parts.countryCode,
        phoneNumber: parts.phoneNumber,
      }));
    },
    []
  );

  const profileImage =
    userProfile?.profilePicture || userProfile?.avatar || user?.photoURL || "";
  const displayName = userProfile?.name || user?.displayName || "User";
  const email = userProfile?.contact?.email || user?.email || "";
  const countryCode = userProfile?.contact?.countryCode || "";
  const phoneNumber = userProfile?.contact?.phone || "";
  const fullPhone =
    countryCode && phoneNumber
      ? `${countryCode} ${phoneNumber}`
      : phoneNumber || "";
  const emailVerified = userProfile?.emailVerified || false;
  const kycVerified = userProfile?.kycVerified || false;

  // Calculate stats
  const tripsTaken = myBookings.filter((b) => b.status === "Approved").length;
  const reviewsCount = 0; // Reviews are stored on trips, not users

  return (
    <div className="min-h-screen bg-background-light text-[#112838]">
      <MaterialSymbolsLoader />
      <DashboardHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-8 border-b border-gray-100">
            <div className="relative shrink-0 group">
              <div className="size-32 md:size-40 rounded-full bg-[#F8FAFC] p-1.5 shadow-sm">
                <div
                  className="w-full h-full rounded-full bg-cover bg-center bg-slate-200"
                  style={
                    profileImage
                      ? { backgroundImage: `url(${profileImage})` }
                      : {}
                  }
                >
                  {!profileImage && (
                    <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-[#112838] text-4xl font-bold font-satoshi-black">
                      {displayName[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 bg-[#112838] text-white p-2.5 rounded-full border-4 border-white shadow-sm cursor-pointer hover:bg-[#0EAFA3] transition-colors group-hover:scale-105">
                <span className="material-symbols-outlined text-[20px] block">
                  photo_camera
                </span>
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#112838] tracking-tight font-satoshi-black">
                {displayName}
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-gray-500 font-medium text-sm md:text-base">
                {email && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC]">
                    <span className="material-symbols-outlined text-[18px]">
                      mail
                    </span>
                    <span>{email}</span>
                  </div>
                )}
                {fullPhone && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC]">
                    <span className="material-symbols-outlined text-[18px]">
                      call
                    </span>
                    <span>{fullPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 order-2 lg:order-1 grid grid-cols-1 gap-4">
              {/* Activity Snapshot */}
              <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-soft">
                <div className="flex items-center gap-3 mb-8">
                  <div className="size-10 rounded-xl bg-[#0EAFA3]/10 flex items-center justify-center text-[#0EAFA3]">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#112838] font-satoshi-bold">
                    Activity Snapshot
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors group cursor-default border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-[#F8FAFC] group-hover:bg-white flex items-center justify-center text-gray-400 group-hover:text-[#112838] transition-colors">
                        <span className="material-symbols-outlined text-lg">
                          flight_takeoff
                        </span>
                      </div>
                      <span className="font-bold text-gray-500 group-hover:text-[#112838] transition-colors font-satoshi-bold text-sm">
                        Trips Taken
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-[#112838] font-satoshi-black">
                      {tripsTaken}
                    </span>
                  </div>
                  <div className="w-full h-px bg-gray-50"></div>
                  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors group cursor-default border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-[#F8FAFC] group-hover:bg-white flex items-center justify-center text-gray-400 group-hover:text-[#0EAFA3] transition-colors">
                        <span className="material-symbols-outlined text-lg">
                          rate_review
                        </span>
                      </div>
                      <span className="font-bold text-gray-500 group-hover:text-[#0EAFA3] transition-colors font-satoshi-bold text-sm">
                        Reviews
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-[#112838] font-satoshi-black">
                      {reviewsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Status Card */}
              {emailVerified || kycVerified ? (
                <div className="bg-gradient-to-br from-[#112838] to-[#1a3b50] rounded-[20px] p-6 text-white shadow-soft relative overflow-hidden">
                  <Earth className="absolute -right-4 -top-4 w-[120px] h-[120px] text-white opacity-5" />
                  <h4 className="font-bold text-lg mb-2 relative z-10 font-satoshi-bold">
                    Trusted Traveller
                  </h4>
                  <p className="text-sm text-white/70 relative z-10 mb-4 font-satoshi">
                    You are a verified member of the TripAbhi community.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0EAFA3] relative z-10 font-satoshi-bold">
                    <span className="material-symbols-outlined text-sm">
                      verified_user
                    </span>
                    <span>Identity Verified</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <h4 className="font-bold text-lg text-[#112838] font-satoshi-bold">
                      Verification Status
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 font-satoshi">
                    Complete your verification to become a Trusted Traveller and
                    unlock exclusive benefits.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 font-satoshi-medium">
                      <span
                        className={`material-symbols-outlined text-sm ${
                          emailVerified ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        {emailVerified ? "check_circle" : "cancel"}
                      </span>
                      <span>
                        Email {emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Personal Details */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-white rounded-[24px] p-8 md:p-10 border border-gray-100 shadow-soft">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                  <h3 className="text-2xl font-bold text-[#112838] font-satoshi-bold">
                    Personal Details
                  </h3>
                  <Link
                    href="/my-settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#112838] bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors font-satoshi-bold"
                  >
                    <span className="material-symbols-outlined text-lg">settings</span>
                    Settings
                  </Link>
                </div>
                <form
                  className="flex flex-col gap-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-extrabold text-[#112838] uppercase tracking-wide ml-1 font-satoshi-black">
                        Full Name
                      </label>
                      <div className="relative group">
                        {isEditing ? (
                          <Input
                            className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#112838]/10 hover:bg-gray-50 rounded-xl px-4 py-3.5 font-bold text-[#112838] focus:ring-0 transition-all placeholder:text-gray-400 font-satoshi-bold"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <input
                            className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#112838]/10 hover:bg-gray-50 rounded-xl px-4 py-3.5 font-bold text-[#112838] focus:ring-0 transition-all placeholder:text-gray-400 font-satoshi-bold"
                            type="text"
                            value={formData.name}
                            readOnly
                          />
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-extrabold text-[#112838] uppercase tracking-wide ml-1 font-satoshi-black">
                        Phone Number
                      </label>
                      <div className="relative group">
                        {isEditing ? (
                          <PhoneInput
                            key={formKey}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onChangeWithParts={handlePhoneChangeWithParts}
                            disabled={loading}
                            placeholder="000-0000"
                          />
                        ) : (
                          <input
                            className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-[#112838]/10 hover:bg-gray-50 rounded-xl px-4 py-3.5 font-bold text-[#112838] focus:ring-0 transition-all placeholder:text-gray-400 font-satoshi-bold"
                            type="tel"
                            value={fullPhone || ""}
                            readOnly
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-extrabold text-[#112838] uppercase tracking-wide ml-1 font-satoshi-black">
                      Email Address
                    </label>
                    <div className="relative opacity-90">
                      <input
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3.5 font-bold text-gray-500 cursor-not-allowed select-none font-satoshi-bold pr-24"
                        readOnly
                        type="email"
                        value={formData.email}
                      />
                      {emailVerified ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100/50">
                          <span className="material-symbols-outlined text-[18px] material-symbols-filled">
                            verified
                          </span>
                          <span className="text-xs font-bold font-satoshi-bold">
                            Verified
                          </span>
                        </div>
                      ) : (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-100/50">
                          <span className="material-symbols-outlined text-[18px]">
                            cancel
                          </span>
                          <span className="text-xs font-bold font-satoshi-bold">
                            Unverified
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 ml-1 font-satoshi">
                      Contact support to change your email address.
                    </p>
                  </div>

                  <div className="h-px w-full bg-gray-50 my-2"></div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={loading}
                          className="px-10 py-4 font-bold text-base rounded-xl font-satoshi-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="px-10 py-4 bg-[#112838] hover:bg-[#112838]/90 text-white font-bold text-base rounded-xl shadow-lg shadow-[#112838]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 font-satoshi-bold"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            save_as
                          </span>
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full md:w-auto px-10 py-4 bg-[#112838] hover:bg-[#112838]/90 text-white font-bold text-base rounded-xl shadow-lg shadow-[#112838]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 font-satoshi-bold"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          save_as
                        </span>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
