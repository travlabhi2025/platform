import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    const bookings = await bookingService.getBookingsForTrip(tripId);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for trip:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings for trip" },
      { status: 500 }
    );
  }
}
