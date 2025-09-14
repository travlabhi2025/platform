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
import { TripFormData } from "@/lib/validations/trip";

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
  const updateAbout = (updates: Partial<TripFormData["about"]>) => {
    updateFormData({
      about: { ...formData.about, ...updates },
    });
  };

  const updateHost = (updates: Partial<TripFormData["host"]>) => {
    updateFormData({
      host: { ...formData.host, ...updates },
    });
  };

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
