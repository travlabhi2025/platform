import { NextRequest, NextResponse } from "next/server";
import {
  bookingService,
  tripService,
  notificationService,
} from "@/lib/firestore";
import { verifyAuth } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);

    const { bookingId, action, rejectionReason } = await request.json();

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: "Booking ID and action are required" },
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
    if (!trip || trip.createdBy !== authResult.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Perform the approval action
    if (action === "approve") {
      await bookingService.approveBooking(bookingId, authResult.userId);

      // Send approval notification to customer
      await notificationService.sendEmail({
        to: booking.travelerEmail,
        subject: `Your booking for ${trip.title} has been approved! 🎉`,
        message: `Great news! Your booking request for ${
          trip.title
        } has been approved by ${
          trip.host?.name || "the organizer"
        }. The organizer will contact you shortly at ${
          booking.travelerPhone
        } with payment details and next steps. Trip details: ${
          trip.about?.location || "Various locations"
        }, ${trip.about?.startDate || "TBD"} to ${
          trip.about?.endDate || "TBD"
        }. Total amount: ₹${booking.totalAmount.toLocaleString("en-IN")} for ${
          booking.groupSize
        } ${booking.groupSize === 1 ? "person" : "people"}.`,
        meta: { bookingId, tripId: trip.id, type: "approval" },
      });

      return NextResponse.json({
        success: true,
        message: "Booking approved and customer notified",
      });
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 }
        );
      }
      await bookingService.rejectBooking(
        bookingId,
        authResult.userId,
        rejectionReason
      );

      // Send rejection notification to customer
      await notificationService.sendEmail({
        to: booking.travelerEmail,
        subject: `Update on your booking request for ${trip.title}`,
        message: `We regret to inform you that your booking request for ${trip.title} has not been approved at this time. Reason: ${rejectionReason}. You can browse other amazing trips on TravlAbhi or contact the organizer for more information.`,
        meta: { bookingId, tripId: trip.id, type: "rejection" },
      });

      return NextResponse.json({
        success: true,
        message: "Booking rejected and customer notified",
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
