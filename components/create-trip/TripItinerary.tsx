"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { TripFormData } from "@/lib/validations/trip";

interface TripItineraryProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function TripItinerary({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
}: TripItineraryProps) {
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  const updateItineraryDay = (
    index: number,
    updates: Partial<TripFormData["itinerary"][0]>
  ) => {
    const updatedItinerary = formData.itinerary.map((day, i) =>
      i === index ? { ...day, ...updates } : day
    );
    updateFormData({ itinerary: updatedItinerary });
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      updateFormData({
        inclusions: [...formData.inclusions, newInclusion.trim()],
      });
      setNewInclusion("");
    }
  };

  const removeInclusion = (index: number) => {
    updateFormData({
      inclusions: formData.inclusions.filter((_, i) => i !== index),
    });
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      updateFormData({
        exclusions: [...formData.exclusions, newExclusion.trim()],
      });
      setNewExclusion("");
    }
  };

  const removeExclusion = (index: number) => {
    updateFormData({
      exclusions: formData.exclusions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Itinerary Days */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Daily Itinerary</h3>
          <p className="text-sm text-gray-500">
            {formData.itinerary.length} days based on your date range
          </p>
        </div>
        {errors.itinerary && (
          <p className="text-sm text-red-500">{errors.itinerary}</p>
        )}

        {formData.itinerary.map((day, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Day {day.day}
                {day.date && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    )
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`day-${index}-title`}>Day Title</Label>
                <Input
                  id={`day-${index}-title`}
                  placeholder="e.g., Arrival and City Tour (optional)"
                  value={day.title || ""}
                  onChange={(e) =>
                    updateItineraryDay(index, { title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`day-${index}-description`}>
                  Description (optional)
                </Label>
                <Textarea
                  id={`day-${index}-description`}
                  placeholder="Describe the activities for this day... (optional)"
                  value={day.description || ""}
                  onChange={(e) =>
                    updateItineraryDay(index, { description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inclusions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What's Included</h3>
        {errors.inclusions && (
          <p className="text-sm text-red-500">{errors.inclusions}</p>
        )}
        <div className="space-y-2">
          {formData.inclusions.map((inclusion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-green-50 rounded-md"
            >
              <span className="flex-1">{inclusion}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInclusion(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add inclusion (e.g., Accommodation, Meals)"
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addInclusion()}
            />
            <Button type="button" onClick={addInclusion} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Exclusions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What's Not Included</h3>
        {errors.exclusions && (
          <p className="text-sm text-red-500">{errors.exclusions}</p>
        )}
        <div className="space-y-2">
          {formData.exclusions.map((exclusion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-red-50 rounded-md"
            >
              <span className="flex-1">{exclusion}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExclusion(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add exclusion (e.g., Personal expenses, Travel insurance)"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addExclusion()}
            />
            <Button type="button" onClick={addExclusion} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
          Next: Review
        </Button>
      </div>
    </div>
  );
}
