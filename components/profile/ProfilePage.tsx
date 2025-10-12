"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/common/SiteHeader";
import { useAuth } from "@/lib/auth-context";
import { Profile } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Save,
  Edit,
  X,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ui/image-upload";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<Profile>({
    name: "",
    avatar: "",
    verified: false,
    kycVerified: false,
    badge: "Organizer",
    logo: "",
    profilePicture: "",
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    socialLinks: {
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
    bio: "",
    company: "",
    title: "",
  });

  // Initialize profile data
  useEffect(() => {
    if (userProfile || user) {
      setProfile({
        name: userProfile?.name || user?.displayName || "",
        avatar: userProfile?.avatar || user?.photoURL || "",
        verified: userProfile?.verified || false,
        kycVerified: userProfile?.kycVerified || false,
        badge: userProfile?.badge || "Organizer",
        logo: userProfile?.logo || "",
        profilePicture: userProfile?.profilePicture || "",
        contact: {
          email: userProfile?.contact?.email || user?.email || "",
          phone: userProfile?.contact?.phone || "",
          address: userProfile?.contact?.address || "",
        },
        socialLinks: {
          website: userProfile?.socialLinks?.website || "",
          instagram: userProfile?.socialLinks?.instagram || "",
          facebook: userProfile?.socialLinks?.facebook || "",
          twitter: userProfile?.socialLinks?.twitter || "",
          linkedin: userProfile?.socialLinks?.linkedin || "",
        },
        bio: userProfile?.bio || "",
        company: userProfile?.company || "",
        title: userProfile?.title || "",
      });
    }
  }, [userProfile, user]);

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (
      profile.contact?.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.contact.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      profile.socialLinks?.website &&
      !/^https?:\/\/.+/.test(profile.socialLinks.website)
    ) {
      newErrors.website =
        "Please enter a valid website URL (starting with http:// or https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user) return;

    if (!validateProfile()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      // Get auth headers with JWT token
      const { getAuthHeaders } = await import("@/lib/auth-helpers");
      const authHeaders = await getAuthHeaders();

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          profile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
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

  const handleCancel = () => {
    // Reset to original data
    if (userProfile || user) {
      setProfile({
        name: userProfile?.name || user?.displayName || "",
        avatar: userProfile?.avatar || user?.photoURL || "",
        verified: userProfile?.verified || false,
        kycVerified: userProfile?.kycVerified || false,
        badge: userProfile?.badge || "Organizer",
        logo: userProfile?.logo || "",
        profilePicture: userProfile?.profilePicture || "",
        contact: {
          email: userProfile?.contact?.email || user?.email || "",
          phone: userProfile?.contact?.phone || "",
          address: userProfile?.contact?.address || "",
        },
        socialLinks: {
          website: userProfile?.socialLinks?.website || "",
          instagram: userProfile?.socialLinks?.instagram || "",
          facebook: userProfile?.socialLinks?.facebook || "",
          twitter: userProfile?.socialLinks?.twitter || "",
          linkedin: userProfile?.socialLinks?.linkedin || "",
        },
        bio: userProfile?.bio || "",
        company: userProfile?.company || "",
        title: userProfile?.title || "",
      });
    }
    setIsEditing(false);
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateContact = (updates: Partial<Profile["contact"]>) => {
    setProfile((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...updates },
    }));
  };

  const updateSocialLinks = (updates: Partial<Profile["socialLinks"]>) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...updates },
    }));
  };

  // Show skeleton loader while profile data is loading
  if (!userProfile && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 pb-28 lg:pb-8 max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-8 pb-28 lg:pb-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile Setup
              </h1>
              <p className="text-gray-600">
                Manage your profile information, contact details, and social
                links
              </p>
            </div>
            <div>
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Row 1: Profile picture (left) and Full Name (right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Profile Picture
                  </Label>
                  {isEditing ? (
                    <ImageUpload
                      value={profile.profilePicture || ""}
                      onChange={(url) => updateProfile({ profilePicture: url })}
                      storagePath="profile-pictures"
                      variant="compact"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      {profile.profilePicture ? (
                        <Image
                          src={profile.profilePicture}
                          alt="Profile Picture"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/images/home/placeholders/profileImg.png"
                          alt="Default Profile"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-gray-500 hidden md:inline">
                        Profile picture uploaded
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => {
                        updateProfile({ name: e.target.value });
                        if (errors.name) {
                          setErrors({ ...errors, name: "" });
                        }
                      }}
                      placeholder="Enter your full name"
                      className={`w-full ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2">
                      {profile.name || "Not set"}
                    </div>
                  )}
                  {isEditing && errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Company and Title in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company/Organization
                  </Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={profile.company || ""}
                      onChange={(e) =>
                        updateProfile({ company: e.target.value })
                      }
                      placeholder="Enter company name"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2">
                      {profile.company || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Title/Position
                  </Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      value={profile.title || ""}
                      onChange={(e) => updateProfile({ title: e.target.value })}
                      placeholder="Enter your title or position"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2">
                      {profile.title || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio
                </Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full"
                  />
                ) : (
                  <div className="text-sm text-gray-900 py-2">
                    {profile.bio || "No bio provided"}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={profile.verified ? "default" : "secondary"}>
                  {profile.verified ? "Verified" : "Unverified"}
                </Badge>
                {profile.kycVerified && (
                  <Badge variant="outline">KYC Verified</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.contact?.email || ""}
                      onChange={(e) => {
                        updateContact({ email: e.target.value });
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                      }}
                      placeholder="Enter email address"
                      className={`w-full ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.contact?.email || "Not set"}
                    </div>
                  )}
                  {isEditing && errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.contact?.phone || ""}
                      onChange={(e) => updateContact({ phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profile.contact?.phone || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profile.contact?.address || ""}
                    onChange={(e) => updateContact({ address: e.target.value })}
                    placeholder="Enter your address"
                    rows={2}
                    className="w-full"
                  />
                ) : (
                  <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.contact?.address || "Not set"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="text-sm font-medium text-gray-700"
                  >
                    Website
                  </Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      type="url"
                      value={profile.socialLinks?.website || ""}
                      onChange={(e) => {
                        updateSocialLinks({ website: e.target.value });
                        if (errors.website) {
                          setErrors({ ...errors, website: "" });
                        }
                      }}
                      placeholder="https://yourwebsite.com"
                      className={`w-full ${
                        errors.website ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {profile.socialLinks?.website ? (
                        <a
                          href={profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.socialLinks.website}
                        </a>
                      ) : (
                        "Not set"
                      )}
                    </div>
                  )}
                  {isEditing && errors.website && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instagram"
                    className="text-sm font-medium text-gray-700"
                  >
                    Instagram
                  </Label>
                  {isEditing ? (
                    <Input
                      id="instagram"
                      value={profile.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        updateSocialLinks({ instagram: e.target.value })
                      }
                      placeholder="@username or URL"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      {profile.socialLinks?.instagram || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="facebook"
                    className="text-sm font-medium text-gray-700"
                  >
                    Facebook
                  </Label>
                  {isEditing ? (
                    <Input
                      id="facebook"
                      value={profile.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        updateSocialLinks({ facebook: e.target.value })
                      }
                      placeholder="Facebook page URL"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      {profile.socialLinks?.facebook || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="twitter"
                    className="text-sm font-medium text-gray-700"
                  >
                    Twitter
                  </Label>
                  {isEditing ? (
                    <Input
                      id="twitter"
                      value={profile.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        updateSocialLinks({ twitter: e.target.value })
                      }
                      placeholder="@username or URL"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      {profile.socialLinks?.twitter || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="linkedin"
                    className="text-sm font-medium text-gray-700"
                  >
                    LinkedIn
                  </Label>
                  {isEditing ? (
                    <Input
                      id="linkedin"
                      value={profile.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        updateSocialLinks({ linkedin: e.target.value })
                      }
                      placeholder="LinkedIn profile URL"
                      className="w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      {profile.socialLinks?.linkedin || "Not set"}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
