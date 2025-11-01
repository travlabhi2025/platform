"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  storagePath?: string; // Custom storage path (e.g., "profile-pictures", "trip-images")
  variant?: "default" | "compact" | "square"; // compact renders a small circular avatar uploader, square renders a square preview
}

export default function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  placeholder = "Upload an image",
  disabled = false,
  className = "",
  maxSizeInMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  storagePath = "trip-images", // Default path for trip images
  variant = "default",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [storageRef, setStorageRef] = useState<ReturnType<typeof ref> | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null);
    setImageLoaded(false); // Reset image loaded state when value changes
  }, [value]);

  // Helper function to extract storage reference from Firebase Storage URL
  const getStorageRefFromUrl = (url: string) => {
    try {
      // Firebase Storage URLs have a specific format
      // Extract the path from the URL to create a storage reference
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const decodedPath = decodeURIComponent(pathMatch[1]);
        return ref(storage, decodedPath);
      }
    } catch (error) {
      console.error("Error extracting storage reference from URL:", error);
    }
    return null;
  };

  // Initialize storage reference if we have a value (for editing existing trips)
  React.useEffect(() => {
    if (value && !storageRef) {
      const refFromUrl = getStorageRefFromUrl(value);
      if (refFromUrl) {
        setStorageRef(refFromUrl);
      }
    }
  }, [value, storageRef]);

  const handleFileSelect = async (file: File) => {
    if (!user) {
      toast.error("Please sign in to upload images");
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP)", {
        id: `file-type-error-${Date.now()}`,
      });
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`, {
        id: `file-size-error-${Date.now()}`,
      });
      return;
    }

    setUploading(true);
    onUploadStart?.(); // Notify parent that upload has started

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${
        storagePath === "profile-pictures" ? "profile" : "image"
      }-${timestamp}.${fileExtension}`;

      // Create storage reference
      const newStorageRef = ref(
        storage,
        `${storagePath}/${user.uid}/${fileName}`
      );

      // Upload file
      const snapshot = await uploadBytes(newStorageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update state
      setPreview(downloadURL);
      setImageLoaded(false); // Will be set to true when image loads
      setStorageRef(newStorageRef);
      onChange(downloadURL);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      onUploadEnd?.(); // Notify parent that upload has ended
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemove = async () => {
    try {
      // Delete from Firebase Storage if we have a storage reference
      if (storageRef) {
        await deleteObject(storageRef);
        console.log("Image deleted from storage successfully");
      }
    } catch (error) {
      console.error("Error deleting image from storage:", error);
      // Don't show error to user as the image is already removed from UI
      // The storage cleanup is a background operation
    } finally {
      // Always clear the UI state
      setPreview(null);
      setStorageRef(null);
      onChange("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  // Compact circular avatar uploader
  if (variant === "compact") {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />
        <div className="relative inline-block">
          {preview ? (
            <>
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
                <Image
                  src={preview}
                  alt="Preview"
                  width={64}
                  height={64}
                  className={`w-16 h-16 rounded-full object-cover cursor-pointer transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={handleClick}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="absolute -top-1 -right-1 bg-white border rounded-full w-5 h-5 grid place-items-center shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled || uploading}
              className="w-16 h-16 rounded-full bg-gray-100 grid place-items-center border text-gray-500 hover:bg-gray-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Square aspect ratio uploader (for profile images)
  if (variant === "square") {
    return (
      <div className={`w-full ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        {preview ? (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {/* Loading skeleton - shown until image loads */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className={`w-full h-auto transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                onClick={handleRemove}
                disabled={disabled || uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
              disabled || uploading
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 bg-white hover:border-primary hover:bg-primary/5 cursor-pointer"
            }`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center py-12 px-6">
              {uploading ? (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Uploading image...
                  </p>
                  <p className="text-xs text-gray-500">
                    Please wait while we process your image
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                    {placeholder}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports JPG, PNG, WebP • Max {maxSizeInMB}MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default large dropzone uploader
  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {preview ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Loading skeleton - shown until image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className={`w-full h-auto transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Also hide skeleton on error
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
            disabled || uploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 bg-white hover:border-primary hover:bg-primary/5 cursor-pointer"
          }`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6">
            {uploading ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Uploading image...
                </p>
                <p className="text-xs text-gray-500">
                  Please wait while we process your image
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  Drag and drop your image here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports JPG, PNG, WebP • Max {maxSizeInMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
