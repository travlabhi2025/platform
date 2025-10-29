"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Label } from "@/components/ui/label";
import { TripFormData } from "@/lib/validations/trip";
import { X, Loader2 } from "lucide-react";

interface TripGalleryProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
  uploadingIndexes: Set<number>;
  onUploadStart?: (index: number) => void;
  onUploadEnd?: (index: number) => void;
}

export default function TripGallery({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
  uploadingIndexes,
  onUploadStart,
  onUploadEnd,
}: TripGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [bulkUploading, setBulkUploading] = useState(false);
  const currentImagesRef = useRef<string[]>(formData.galleryImages || []);

  // Keep a ref in sync with latest gallery images to avoid stale closures
  useEffect(() => {
    currentImagesRef.current = formData.galleryImages || [];
  }, [formData.galleryImages]);
  const removeGalleryImage = (index: number) => {
    const images = currentImagesRef.current;
    const newGalleryImages = images.filter((_, i) => i !== index);
    currentImagesRef.current = newGalleryImages;
    updateFormData({ galleryImages: newGalleryImages });

    // Remove from uploading set if it was uploading
    onUploadEnd?.(index);
  };

  const updateGalleryImage = (index: number, url: string) => {
    const images = currentImagesRef.current;
    const newGalleryImages = [...images];
    newGalleryImages[index] = url;
    currentImagesRef.current = newGalleryImages;
    updateFormData({ galleryImages: newGalleryImages });
  };

  const onClickBulkUpload = () => {
    if (bulkUploading) return;
    fileInputRef.current?.click();
  };

  const handleBulkFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !user) return;

    setBulkUploading(true);
    try {
      // Add placeholders for each file
      const startIndex = (formData.galleryImages || []).length;
      const newPlaceholders = files.map(() => "");
      const initial = [...(formData.galleryImages || []), ...newPlaceholders];
      updateFormData({ galleryImages: initial });

      // Upload sequentially to manage indices
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const index = startIndex + i;
        onUploadStart?.(index);

        const timestamp = Date.now();
        const ext = file.name.split(".").pop();
        const fileName = `image-${timestamp + i}.${ext}`;
        const storageRef = ref(storage, `trip-images/${user.uid}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        updateGalleryImage(index, url);
        onUploadEnd?.(index);
      }
    } finally {
      setBulkUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Check if there are empty image cards or uploading images
  const hasEmptyImages = (formData.galleryImages || []).some((url) => !url);
  const hasUploadingImages = uploadingIndexes.size > 0 || bulkUploading;

  // Check if next button should be disabled
  const isNextDisabled = hasEmptyImages || hasUploadingImages;

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
        {/* Multi-upload input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleBulkFiles}
          className="hidden"
        />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClickBulkUpload}
            disabled={bulkUploading}
            className="border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkUploading ? "Uploading..." : "Upload Photos"}
          </Button>
        </div>
        {/* Preview existing gallery images with original dimensions */}
        <div className="grid grid-cols-1 gap-6">
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
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-auto rounded-md border"
                    onLoad={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.setAttribute(
                        "data-dimensions",
                        `${img.naturalWidth}×${img.naturalHeight}`
                      );
                    }}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Dimensions:{" "}
                    {typeof window !== "undefined"
                      ? (
                          document.querySelector(
                            `img[src='${imageUrl.replace(/'/g, "\\'")}']`
                          ) as HTMLImageElement | null
                        )?.getAttribute("data-dimensions") || "Loading..."
                      : "Loading..."}
                  </div>
                </>
              ) : (
                <div className="w-full rounded-md border bg-gray-50 p-8 flex items-center justify-center text-gray-500 text-sm">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Removed single-image button completely as requested */}

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
          disabled={isNextDisabled}
          className="bg-primary hover:bg-primary/90 px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNextDisabled
            ? hasEmptyImages
              ? "Upload all images or remove empty cards"
              : "Uploading images..."
            : "Next: FAQs"}
        </Button>
      </div>
    </div>
  );
}
