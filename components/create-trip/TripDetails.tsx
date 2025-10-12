"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import ImageUpload from "@/components/ui/image-upload";
import { TripFormData } from "@/lib/validations/trip";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useCallback } from "react";

interface TripDetailsProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

const tripTypes = [
  "Adventure",
  "Cultural",
  "Religious",
  "Beach",
  "Mountain",
  "Wildlife",
  "City Tour",
  "Road Trip",
  "Trekking",
  "Photography",
];

export default function TripDetails({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
}: TripDetailsProps) {
  const { user, userProfile } = useAuth();

  const updateAbout = useCallback(
    (updates: Partial<TripFormData["about"]>) => {
      updateFormData({
        about: { ...formData.about, ...updates },
      });
    },
    [formData.about, updateFormData]
  );

  const updateHost = useCallback(
    (updates: Partial<TripFormData["host"]>) => {
      updateFormData({
        host: { ...formData.host, ...updates },
      });
    },
    [formData.host, updateFormData]
  );

  // Populate host information with profile data if not already set
  useEffect(() => {
    if (userProfile && userProfile.id) {
      console.log("Auto-filling host info:", {
        profileName: userProfile.name,
        profileBio: userProfile.bio,
        profilePicture: userProfile.profilePicture,
        avatar: userProfile.avatar,
        userPhotoURL: user?.photoURL,
        selectedProfileImage:
          userProfile.profilePicture || userProfile.avatar || user?.photoURL,
        currentHostName: formData.host.name,
        currentHostDescription: formData.host.description,
        currentHostImage: formData.host.organizerImage,
      });

      const hostUpdates: Partial<TripFormData["host"]> = {};
      let hasUpdates = false;

      // Set host name from profile if not already set (check for empty string or undefined)
      if (
        (!formData.host.name || formData.host.name.trim() === "") &&
        (userProfile.name || user?.displayName)
      ) {
        hostUpdates.name = userProfile.name || user?.displayName || "";
        hasUpdates = true;
      }

      // Set host description from profile bio if not already set (check for empty string or undefined)
      if (
        (!formData.host.description ||
          formData.host.description.trim() === "") &&
        userProfile.bio
      ) {
        hostUpdates.description = userProfile.bio;
        hasUpdates = true;
      }

      // Set host image from profile picture if not already set (check for empty string or undefined)
      const profileImage =
        userProfile.profilePicture || userProfile.avatar || user?.photoURL;
      if (
        (!formData.host.organizerImage ||
          formData.host.organizerImage.trim() === "") &&
        profileImage
      ) {
        hostUpdates.organizerImage = profileImage;
        hasUpdates = true;
      }

      // Only update if we have something to set
      if (hasUpdates) {
        updateHost(hostUpdates);
      }
    }
  }, [
    userProfile,
    user,
    updateHost,
    formData.host.name,
    formData.host.description,
    formData.host.organizerImage,
  ]); // Include all dependencies

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Manali, Himachal Pradesh"
            value={formData.about.location}
            onChange={(e) => updateAbout({ location: e.target.value })}
            required
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <DatePicker
            value={formData.about.startDate}
            onChange={(date) =>
              updateAbout({
                startDate: date || "",
              })
            }
            placeholder="Select start date"
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <DatePicker
            value={formData.about.endDate}
            onChange={(date) =>
              updateAbout({
                endDate: date || "",
              })
            }
            placeholder="Select end date"
            minDate={formData.about.startDate}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="tripType" className="w-full">
            Trip Type *
          </Label>
          <Select
            value={formData.about.tripType}
            onValueChange={(value) => updateAbout({ tripType: value })}
          >
            <SelectTrigger
              className={`${errors.tripType ? "border-red-500" : ""} w-full`}
            >
              <SelectValue placeholder="Select trip type" />
            </SelectTrigger>
            <SelectContent>
              {tripTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tripType && (
            <p className="text-sm text-red-500">{errors.tripType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupSizeMin">Min Group Size</Label>
          <Input
            id="groupSizeMin"
            type="number"
            min="1"
            value={formData.about.groupSizeMin}
            onChange={(e) =>
              updateAbout({ groupSizeMin: parseInt(e.target.value) || 1 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupSizeMax">Max Group Size</Label>
          <Input
            id="groupSizeMax"
            type="number"
            min="1"
            value={formData.about.groupSizeMax}
            onChange={(e) =>
              updateAbout({ groupSizeMax: parseInt(e.target.value) || 10 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageMin">Min Age</Label>
          <Input
            id="ageMin"
            type="number"
            min="1"
            value={formData.about.ageMin}
            onChange={(e) =>
              updateAbout({ ageMin: parseInt(e.target.value) || 18 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageMax">Max Age</Label>
          <Input
            id="ageMax"
            type="number"
            min="1"
            value={formData.about.ageMax}
            onChange={(e) =>
              updateAbout({ ageMax: parseInt(e.target.value) || 65 })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Host information is pre-filled from your
            profile. You can modify it below if needed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hostName">Host Name *</Label>
          <Input
            id="hostName"
            placeholder="Your name or organization name"
            value={formData.host.name}
            onChange={(e) => updateHost({ name: e.target.value })}
            required
            className={errors.hostName ? "border-red-500" : ""}
          />
          {errors.hostName && (
            <p className="text-sm text-red-500">{errors.hostName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hostDescription">Host Description *</Label>
          <Textarea
            id="hostDescription"
            placeholder="Tell travelers about yourself and your experience..."
            value={formData.host.description}
            onChange={(e) => updateHost({ description: e.target.value })}
            rows={4}
            required
            className={errors.hostDescription ? "border-red-500" : ""}
          />
          {errors.hostDescription && (
            <p className="text-sm text-red-500">{errors.hostDescription}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="hostImage"
            className="text-sm font-medium text-gray-700"
          >
            Host Image (Optional)
          </Label>
          <ImageUpload
            value={formData.host.organizerImage || ""}
            onChange={(url) => updateHost({ organizerImage: url })}
            placeholder="Upload your profile picture or company logo"
            maxSizeInMB={3}
            storagePath="organizer-images"
            variant="compact"
          />
          <p className="text-sm text-gray-500 mt-1">
            Add your profile picture or company logo to build trust with
            travelers
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
          Next: Itinerary
        </Button>
      </div>
    </div>
  );
}
