import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";
import { verifyAuth, verifyAuthAndRole } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    // Try to get authenticated user, but don't fail if not authenticated (guest bookings)
    let userId = null;
    try {
      // If user is authenticated, check role (block organisers)
      const authResult = await verifyAuthAndRole(request);
      userId = authResult.userId;
    } catch {
      // User not authenticated - this is okay for guest bookings
      // Or user is organiser - also treat as unauthenticated for guest flow
      console.log("No authenticated customer user for booking check");
    }

    // If user is authenticated, check for duplicates by userId
    if (userId) {
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
        isAuthenticated: true,
      });
    }

    // For guest users, return no existing booking
    return NextResponse.json({
      hasBooked: false,
      existingBooking: null,
      isAuthenticated: false,
    });
  } catch (error) {
    console.error("Error checking booking status:", error);

    // Return 401 for authentication errors
    if (
      error instanceof Error &&
      (error.message.includes("token") ||
        error.message.includes("authenticated"))
    ) {
      return NextResponse.json(
        { error: "Unauthorized - " + error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to check booking status" },
      { status: 500 }
    );
  }
}
