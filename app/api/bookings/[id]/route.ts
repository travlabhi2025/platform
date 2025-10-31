import { NextRequest, NextResponse } from "next/server";
import { bookingService, tripService, notificationService, userService } from "@/lib/firestore";
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
    const oldStatus = booking.status;

    if (updates.status) {
      await bookingService.updateBookingStatus(id, updates.status);
      
      // Send email notification if status changed
      if (updates.status !== oldStatus) {
        const updatedBooking = await bookingService.getBookingById(id);
        if (updatedBooking && trip) {
          // Get organizer info for email
          const organizerProfile = await userService.getUserById(trip.createdBy);
          const organizerName = trip.host?.name || organizerProfile?.name || "Organizer";
          
          // Determine email content based on status change
          let subject = "";
          let message = "";
          
          if (updates.status === "Approved") {
            subject = `Your booking for ${trip.title} has been approved! 🎉`;
            message = `Great news! Your booking request for ${trip.title} has been approved by ${organizerName}.\n\n` +
              `Trip Details:\n` +
              `- Location: ${trip.about?.location || "Various locations"}\n` +
              `- Dates: ${trip.about?.startDate || "TBD"} to ${trip.about?.endDate || "TBD"}\n` +
              `- Group Size: ${updatedBooking.groupSize} ${updatedBooking.groupSize === 1 ? "person" : "people"}\n` +
              `- Total Amount: ₹${updatedBooking.totalAmount.toLocaleString("en-IN")}\n\n` +
              `The organizer will contact you shortly at ${updatedBooking.travelerPhone} with payment details and next steps.\n\n` +
              `Thank you for choosing TravlAbhi!`;
          } else if (updates.status === "Rejected") {
            subject = `Update on your booking request for ${trip.title}`;
            message = `We regret to inform you that your booking request for ${trip.title} has not been approved at this time.\n\n` +
              `Trip Details:\n` +
              `- Location: ${trip.about?.location || "Various locations"}\n` +
              `- Dates: ${trip.about?.startDate || "TBD"} to ${trip.about?.endDate || "TBD"}\n` +
              `- Group Size: ${updatedBooking.groupSize} ${updatedBooking.groupSize === 1 ? "person" : "people"}\n\n` +
              `${updatedBooking.rejectionReason ? `Reason: ${updatedBooking.rejectionReason}\n\n` : ""}` +
              `You can browse other amazing trips on TravlAbhi or contact the organizer for more information.\n\n` +
              `Thank you for your interest!`;
          } else if (updates.status === "Pending") {
            subject = `Booking status update for ${trip.title}`;
            message = `Your booking for ${trip.title} status has been updated to Pending.\n\n` +
              `Trip Details:\n` +
              `- Location: ${trip.about?.location || "Various locations"}\n` +
              `- Dates: ${trip.about?.startDate || "TBD"} to ${trip.about?.endDate || "TBD"}\n` +
              `- Group Size: ${updatedBooking.groupSize} ${updatedBooking.groupSize === 1 ? "person" : "people"}\n` +
              `- Total Amount: ₹${updatedBooking.totalAmount.toLocaleString("en-IN")}\n\n` +
              `The organizer is reviewing your booking. You will be notified once a decision is made.\n\n` +
              `Thank you for your patience!`;
          }

          // Send notification to customer
          if (subject && message) {
            await notificationService.sendEmail({
              to: updatedBooking.travelerEmail,
              subject,
              message,
              meta: { 
                bookingId: id, 
                tripId: trip.id, 
                type: "status-change",
                oldStatus,
                newStatus: updates.status
              },
            });
          }
        }
      }
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
