import { z } from "zod";

// Package schema for multiple payment plans
export const packageSchema = z.object({
  id: z.string().optional(), // Auto-generated if not provided
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  priceInInr: z
    .number()
    .min(1, "Price must be greater than 0")
    .max(1000000, "Price seems too high"),
  currency: z.string().default("INR"),
  perPerson: z.boolean().default(true),
  features: z.array(z.string()).optional(), // Optional features list for this package
});

export const tripFormSchema = z.object({
  title: z
    .string()
    .min(1, "Trip title is required")
    .max(100, "Title must be less than 100 characters"),
  heroImageUrl: z.string().min(1, "Hero image is required"),
  galleryImages: z.array(z.string()).optional(), // Array of gallery image URLs
  // Support both old format (backward compatibility) and new packages format
  priceInInr: z.number().optional(), // Deprecated, kept for backward compatibility
  currency: z.string().optional(), // Deprecated
  perPerson: z.boolean().optional(), // Deprecated
  packages: z
    .array(packageSchema)
    .min(1, "At least one package is required")
    .default([]),
  about: z
    .object({
      tripName: z.string().min(1, "Trip name is required"),
      location: z.string().min(1, "Location is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      groupSizeMin: z.number().min(1, "Minimum group size must be at least 1"),
      groupSizeMax: z.number().min(1, "Maximum group size must be at least 1"),
      ageMin: z.number().min(1, "Minimum age must be at least 1"),
      ageMax: z.number().min(1, "Maximum age must be at least 1"),
      tripTypes: z
        .array(z.string().min(1, "Trip type cannot be empty"))
        .min(1, "Select at least one trip type"),
    })
    .refine((data) => data.groupSizeMax >= data.groupSizeMin, {
      message:
        "Maximum group size must be greater than or equal to minimum group size",
      path: ["groupSizeMax"],
    })
    .refine((data) => data.ageMax >= data.ageMin, {
      message: "Maximum age must be greater than or equal to minimum age",
      path: ["ageMax"],
    })
    .refine(
      (data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate >= startDate;
      },
      {
        message: "End date cannot be before start date",
        path: ["endDate"],
      }
    ),
  host: z.object({
    name: z.string().min(1, "Host name is required"),
    rating: z.number().min(1).max(5),
    reviewsCount: z.number().min(0),
    description: z
      .string()
      .min(10, "Host description must be at least 10 characters"),
    organizerImage: z.string().optional(), // Optional organizer image URL
  }),
  itinerary: z
    .array(
      z.object({
        day: z.number().min(1),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .min(1, "At least one itinerary day is required"),
  inclusions: z
    .array(z.string().min(1, "Inclusion cannot be empty"))
    .min(1, "At least one inclusion is required"),
  exclusions: z
    .array(z.string().min(1, "Exclusion cannot be empty"))
    .min(1, "At least one exclusion is required"),
  reviewsSummary: z.object({
    average: z.number().min(1).max(5),
    totalCount: z.number().min(0),
    distribution: z.object({
      5: z.number(),
      4: z.number(),
      3: z.number(),
      2: z.number(),
      1: z.number(),
    }),
  }),
  reviews: z.array(z.any()).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
  relatedTrips: z.array(z.any()).optional(),
  status: z.enum(["Upcoming", "Ongoing", "Active", "Completed", "Cancelled"]),
});

export type TripFormData = z.infer<typeof tripFormSchema>;

// Helper function to calculate days between dates (inclusive)
export function calculateDaysBetween(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 for inclusive
  return daysDiff;
}

// Helper function to generate itinerary days based on date range
export function generateItineraryDays(startDate: string, endDate: string) {
  const days = calculateDaysBetween(startDate, endDate);
  const itinerary = [];

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    itinerary.push({
      day: i + 1,
      title: "",
      description: "",
      date: currentDate.toISOString().split("T")[0],
    });
  }

  return itinerary;
}

// Helper function to merge existing itinerary with new date range
// Preserves existing data where possible (by day number or date)
export function mergeItineraryWithNewDates(
  oldItinerary: Array<{ day: number; title?: string; description?: string; date?: string }>,
  newStartDate: string,
  newEndDate: string
) {
  const newItinerary = generateItineraryDays(newStartDate, newEndDate);
  const oldDaysCount = oldItinerary.length;
  const newDaysCount = newItinerary.length;

  // Create a map of old itinerary by day number for quick lookup
  const oldByDay = new Map<number, typeof oldItinerary[0]>();
  oldItinerary.forEach((item) => {
    oldByDay.set(item.day, item);
  });

  // Create a map of old itinerary by date for quick lookup
  const oldByDate = new Map<string, typeof oldItinerary[0]>();
  oldItinerary.forEach((item) => {
    if (item.date) {
      oldByDate.set(item.date, item);
    }
  });

  // Merge: try to preserve existing data, but always use new dates
  const merged = newItinerary.map((newDay, index) => {
    const dayNumber = index + 1;
    
    // CRITICAL: Always use the new date from the new date range - this ensures dates are updated
    // newDay.date comes from generateItineraryDays which creates dates based on newStartDate/newEndDate
    const newDate = newDay.date || "";
    
    // Start with the new date and empty content
    const result: { day: number; date: string; title: string; description: string } = {
      day: newDay.day,
      date: newDate, // Always use the new date - this is the key!
      title: "",
      description: "",
    };
    
    // First, try to match by date (most accurate) - only if dates happen to match exactly
    if (newDate) {
      const oldByDateMatch = oldByDate.get(newDate);
      if (oldByDateMatch) {
        // Dates match exactly, preserve title and description
        result.title = oldByDateMatch.title || "";
        result.description = oldByDateMatch.description || "";
        // Date is already set to newDate above
        return result;
      }
    }

    // Then, try to match by day number (if same position)
    // This handles the case where dates shift but day numbers stay the same
    // Example: Original dates Jan 1-3, new dates Jan 5-7
    // Day 1 content should map to new Day 1 (Jan 5), not old Day 1 (Jan 1)
    if (dayNumber <= oldDaysCount) {
      const oldByDayMatch = oldByDay.get(dayNumber);
      if (oldByDayMatch) {
        // Preserve title and description from old day, but use NEW date
        result.title = oldByDayMatch.title || "";
        result.description = oldByDayMatch.description || "";
        // Date is already set to newDate above - this ensures dates are updated!
        return result;
      }
    }

    // If no match, return the new empty day with new date
    return result;
  });
  
  // Debug logging to verify dates are being set correctly
  console.log("mergeItineraryWithNewDates result:", {
    newStartDate,
    newEndDate,
    oldDaysCount,
    newDaysCount,
    mergedLength: merged.length,
    firstDay: merged[0],
    lastDay: merged[merged.length - 1],
  });
  
  return merged;
}
