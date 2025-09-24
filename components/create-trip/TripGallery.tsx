"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import { TripFormData } from "@/lib/validations/trip";
import { X, Plus } from "lucide-react";

interface TripGalleryProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function TripGallery({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
}: TripGalleryProps) {
  const addGalleryImage = () => {
    const newGalleryImages = [...(formData.galleryImages || []), ""];
    updateFormData({ galleryImages: newGalleryImages });
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryImages =
      formData.galleryImages?.filter((_, i) => i !== index) || [];
    updateFormData({ galleryImages: newGalleryImages });
  };

  const updateGalleryImage = (index: number, url: string) => {
    const newGalleryImages = [...(formData.galleryImages || [])];
    newGalleryImages[index] = url;
    updateFormData({ galleryImages: newGalleryImages });
  };

  const handleImageUpload = async (index: number, url: string) => {
    updateGalleryImage(index, url);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Trip Gallery
        </Label>
        <p className="text-sm text-gray-500">
          Add additional images to showcase your trip. These will be displayed
          in a gallery before the reviews section.
        </p>
        {errors.galleryImages && (
          <p className="text-sm text-red-500 mt-1">{errors.galleryImages}</p>
        )}
      </div>

      <div className="space-y-6">
        {/* Existing gallery images */}
        {(formData.galleryImages || []).map((imageUrl, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">
                Gallery Image {index + 1}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGalleryImage(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => handleImageUpload(index, url)}
              placeholder="Upload a gallery image"
              maxSizeInMB={5}
              storagePath="trip-images"
            />
          </div>
        ))}

        {/* Add new image button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={addGalleryImage}
            className="border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-600 hover:text-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gallery Image
          </Button>
        </div>

        {formData.galleryImages && formData.galleryImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No gallery images added yet.</p>
            <p className="text-xs mt-1">
              Click &quot;Add Gallery Image&quot; to get started.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-6 py-2 text-sm font-medium"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm font-medium"
        >
          Next: FAQs
        </Button>
      </div>
    </div>
  );
}
