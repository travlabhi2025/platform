"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { TripFormData, calculateDaysBetween, mergeItineraryWithNewDates } from "@/lib/validations/trip";

interface TripItineraryProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

// Suggested inclusions and exclusions
const SUGGESTED_INCLUSIONS = [
  "Accommodation",
  "Transportation",
  "Meals",
  "Guided tours",
  "Entrance fees",
  "Activities",
  "Tour guide",
  "Taxes",
];

const SUGGESTED_EXCLUSIONS = [
  "Airfare",
  "Personal expenses",
  "Optional activities",
  "Travel insurance",
  "Visa fees",
  "Gratuities",
  "Unlisted meals",
  "Additional services",
];

export default function TripItinerary({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
}: TripItineraryProps) {
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  // Ensure itinerary stays in sync with dates
  useEffect(() => {
    if (!formData.about.startDate || !formData.about.endDate) return;
    
    const expectedDays = calculateDaysBetween(
      formData.about.startDate,
      formData.about.endDate
    );
    
    // Check if itinerary needs syncing (length mismatch OR dates don't match)
    const needsSync = formData.itinerary.length !== expectedDays ||
      formData.itinerary.some((day, index) => {
        if (!day.date) return true; // Missing date needs sync
        // Calculate what the date should be for this day
        const expectedDate = new Date(formData.about.startDate);
        expectedDate.setDate(expectedDate.getDate() + index);
        const expectedDateStr = expectedDate.toISOString().split("T")[0];
        return day.date !== expectedDateStr;
      });
    
    if (needsSync) {
      console.log("TripItinerary: Syncing itinerary with dates", {
        currentLength: formData.itinerary.length,
        expectedDays,
        startDate: formData.about.startDate,
        endDate: formData.about.endDate,
        sampleDay: formData.itinerary[0],
      });
      
      const syncedItinerary = mergeItineraryWithNewDates(
        formData.itinerary,
        formData.about.startDate,
        formData.about.endDate
      );
      
      // Update if anything changed
      const hasChanges = syncedItinerary.length !== formData.itinerary.length ||
        syncedItinerary.some((day, i) => {
          const oldDay = formData.itinerary[i];
          return !oldDay || day.date !== oldDay.date || day.title !== oldDay.title || day.description !== oldDay.description;
        });
      
      if (hasChanges) {
        console.log("TripItinerary: Updating itinerary with synced dates", {
          syncedDates: syncedItinerary.map(d => ({ day: d.day, date: d.date })),
        });
        updateFormData({ itinerary: syncedItinerary });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.about.startDate, formData.about.endDate]);

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

  const addSuggestedInclusion = (suggestion: string) => {
    if (!formData.inclusions.includes(suggestion)) {
      updateFormData({
        inclusions: [...formData.inclusions, suggestion],
      });
    }
  };

  const addSuggestedExclusion = (suggestion: string) => {
    if (!formData.exclusions.includes(suggestion)) {
      updateFormData({
        exclusions: [...formData.exclusions, suggestion],
      });
    }
  };

  // Calculate days from current date range to ensure accuracy
  const daysCount = formData.about.startDate && formData.about.endDate
    ? calculateDaysBetween(formData.about.startDate, formData.about.endDate)
    : formData.itinerary.length;

  return (
    <div className="space-y-6">
      {/* Itinerary Days */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Daily Itinerary</h3>
          <p className="text-sm text-gray-500">
            {daysCount} days based on your date range
          </p>
        </div>
        {errors.itinerary && (
          <p className="text-sm text-red-500">{errors.itinerary}</p>
        )}

        {formData.itinerary.map((day, index) => (
          <Card key={`day-${day.day}-${day.date || index}`}>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor={`day-${index}-description`}>
                    Description (optional)
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      const popover = document.getElementById(`markdown-hint-${index}`);
                      if (popover) {
                        popover.classList.toggle("hidden");
                      }
                    }}
                    className="text-xs text-primary hover:text-primary/80 underline"
                  >
                    Formatting help
                  </button>
                </div>
                <div
                  id={`markdown-hint-${index}`}
                  className="hidden text-xs text-gray-600 bg-gray-50 p-3 rounded-md mb-2 space-y-1"
                >
                  <p className="font-semibold mb-1">Markdown formatting supported:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li><code className="bg-gray-200 px-1 rounded"># Heading</code> for headings</li>
                    <li><code className="bg-gray-200 px-1 rounded">- Item</code> or <code className="bg-gray-200 px-1 rounded">* Item</code> for bullets</li>
                    <li>Press Enter twice for new paragraphs</li>
                    <li><code className="bg-gray-200 px-1 rounded">**bold**</code> for bold text</li>
                  </ul>
                </div>
                <Textarea
                  id={`day-${index}-description`}
                  placeholder="Describe the activities for this day... (optional)

You can use markdown formatting:
- Use # for headings
- Use - or * for bullet points
- Press Enter twice for new paragraphs"
                  value={day.description || ""}
                  onChange={(e) =>
                    updateItineraryDay(index, { description: e.target.value })
                  }
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inclusions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What&apos;s Included</h3>
        {errors.inclusions && (
          <p className="text-sm text-red-500">{errors.inclusions}</p>
        )}

        {/* Suggested inclusions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Quick add suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INCLUSIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSuggestedInclusion(suggestion)}
                disabled={formData.inclusions.includes(suggestion)}
                className="text-xs h-8 px-3"
              >
                + {suggestion}
              </Button>
            ))}
          </div>
        </div>

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
              placeholder="Add custom inclusion"
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
        <h3 className="text-lg font-semibold">What&apos;s Not Included</h3>
        {errors.exclusions && (
          <p className="text-sm text-red-500">{errors.exclusions}</p>
        )}

        {/* Suggested exclusions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Quick add suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_EXCLUSIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSuggestedExclusion(suggestion)}
                disabled={formData.exclusions.includes(suggestion)}
                className="text-xs h-8 px-3"
              >
                + {suggestion}
              </Button>
            ))}
          </div>
        </div>

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
              placeholder="Add custom exclusion"
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
          Next: Gallery
        </Button>
      </div>
    </div>
  );
}
