import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");
    const organizerId = searchParams.get("organizerId");

    if (!organizerId) {
      return NextResponse.json(
        { error: "Organizer ID is required" },
        { status: 400 }
      );
    }

    let bookings;

    if (tripId) {
      // Get all bookings for a specific trip (not just pending)
      bookings = await bookingService.getBookingsForTrip(tripId);
    } else {
      // Get all bookings for the organizer across all their trips
      bookings = await bookingService.getBookingsForOrganizer(organizerId);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending bookings" },
      { status: 500 }
    );
  }
}
