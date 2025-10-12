import { NextRequest, NextResponse } from "next/server";
import { bookingService, tripService } from "@/lib/firestore";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication
    const authResult = await verifyAuth(request);

    // Check if booking exists
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify the user is authorized to update this booking
    // (either the organizer of the trip or the person who made the booking)
    const trip = await tripService.getTripById(booking.tripId);
    if (
      !trip ||
      (trip.createdBy !== authResult.userId &&
        booking.createdBy !== authResult.userId)
    ) {
      return NextResponse.json(
        { error: "Unauthorized to update this booking" },
        { status: 403 }
      );
    }

    const updates = await request.json();

    if (updates.status) {
      await bookingService.updateBookingStatus(id, updates.status);
    }

    if (updates.paymentStatus) {
      await bookingService.updatePaymentStatus(id, updates.paymentStatus);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
