import { NextRequest, NextResponse } from "next/server";
import { bookingService, tripService } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, action, rejectionReason, userId } = await request.json();

    if (!bookingId || !action || !userId) {
      return NextResponse.json(
        { error: "Booking ID, action, and User ID are required" },
        { status: 400 }
      );
    }

    // Verify the user is the organizer of this trip
    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Get the trip to verify ownership
    const trip = await tripService.getTripById(booking.tripId);
    if (!trip || trip.createdBy !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Perform the approval action
    if (action === "approve") {
      await bookingService.approveBooking(bookingId, userId);
      return NextResponse.json({
        success: true,
        message: "Booking approved successfully",
      });
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 }
        );
      }
      await bookingService.rejectBooking(bookingId, userId, rejectionReason);
      return NextResponse.json({
        success: true,
        message: "Booking rejected successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing booking approval:", error);
    return NextResponse.json(
      { error: "Failed to process booking approval" },
      { status: 500 }
    );
  }
}
