import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const tripId = searchParams.get("tripId");

    if (!userId || !tripId) {
      return NextResponse.json(
        { error: "User ID and Trip ID are required" },
        { status: 400 }
      );
    }

    const hasBooked = await bookingService.hasUserBookedTrip(userId, tripId);
    const existingBooking = hasBooked
      ? await bookingService.getUserBookingForTrip(userId, tripId)
      : null;

    return NextResponse.json({
      hasBooked,
      existingBooking: existingBooking
        ? {
            id: existingBooking.id,
            status: existingBooking.status,
            bookingDate: existingBooking.bookingDate,
            totalAmount: existingBooking.totalAmount,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking booking status:", error);
    return NextResponse.json(
      { error: "Failed to check booking status" },
      { status: 500 }
    );
  }
}
