import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get("organizerId");
    const tripId = searchParams.get("tripId");

    if (!organizerId) {
      return NextResponse.json(
        { error: "Organizer ID is required" },
        { status: 400 }
      );
    }

    let stats;
    if (tripId) {
      // Get stats for a specific trip
      const bookings = await bookingService.getBookingsForTrip(tripId);
      stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "Pending").length,
        approved: bookings.filter((b) => b.status === "Approved").length,
        rejected: bookings.filter((b) => b.status === "Rejected").length,
      };
    } else {
      // Get stats for all trips by the organizer
      stats = await bookingService.getBookingStatsForOrganizer(organizerId);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking statistics" },
      { status: 500 }
    );
  }
}
