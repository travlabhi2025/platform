"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import { TripFormData } from "@/lib/validations/trip";
import TripPackages from "./TripPackages";

interface TripBasicInfoProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

export default function TripBasicInfo({
  formData,
  updateFormData,
  onNext,
  errors,
}: TripBasicInfoProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Trip Title *
        </Label>
        <Input
          id="title"
          placeholder="e.g., Amazing Himalayan Adventure"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          required
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="heroImage"
          className="text-sm font-medium text-gray-700"
        >
          Hero Image *
        </Label>
        <ImageUpload
          value={formData.heroImageUrl}
          onChange={(url) => updateFormData({ heroImageUrl: url })}
          placeholder="Upload a compelling image that represents your trip"
          maxSizeInMB={5}
        />
        {errors.heroImageUrl && (
          <p className="text-sm text-red-500 mt-1">{errors.heroImageUrl}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Upload a high-quality image that showcases your trip destination
        </p>
      </div>

      {/* Packages Section */}
      <TripPackages
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm font-medium"
        >
          Next: Trip Details
        </Button>
      </div>
    </div>
  );
}
