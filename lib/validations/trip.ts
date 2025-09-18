import { z } from "zod";

export const tripFormSchema = z.object({
  title: z
    .string()
    .min(1, "Trip title is required")
    .max(100, "Title must be less than 100 characters"),
  heroImageUrl: z.string().min(1, "Hero image is required"),
  priceInInr: z
    .number()
    .min(1, "Price must be greater than 0")
    .max(1000000, "Price seems too high"),
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
      tripType: z.string().min(1, "Trip type is required"),
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
  bookings: z.number().min(0),
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
