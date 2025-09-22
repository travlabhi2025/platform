import { NextRequest, NextResponse } from "next/server";
import {
  bookingService,
  notificationService,
  tripService,
} from "@/lib/firestore";

export async function GET(request: NextRequest) {
  try {
    // Prefer explicit user header to avoid server-side auth context issues
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    // Return bookings for trips created by this organizer (not the user's own bookings)
    const bookings = await bookingService.getBookingsForOrganizer(userId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    const {
      tripId,
      travelerName,
      travelerEmail,
      travelerPhone,
      groupSize,
      preferences,
    } = bookingData || {};

    // Validate required fields
    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    if (!travelerName || !travelerEmail || !travelerPhone) {
      return NextResponse.json(
        { error: "Traveler information is required" },
        { status: 400 }
      );
    }

    // Get trip details to calculate total amount
    const trip = await tripService.getTripById(tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const validGroupSize = Math.max(1, Number(groupSize || 1));
    const totalAmount = (trip.priceInInr || 0) * validGroupSize;

    // Create booking with only essential information
    const bookingId = await bookingService.createBooking({
      tripId,
      travelerName,
      travelerEmail,
      travelerPhone,
      groupSize: validGroupSize,
      preferences: preferences || "",
      totalAmount,
      status: "Pending",
      bookingDate: new Date(),
    });

    // Send email notifications
    const organizerName = trip.host?.name || "Organizer";
    const tripName = trip.title || "Trip";

    // Organizer notification
    await notificationService.sendEmail({
      to: trip.createdBy || "organizer@example.com",
      subject: `New booking request for ${tripName}`,
      message: `${travelerName} has requested to book the ${tripName} for ${validGroupSize} people. Estimated amount: ₹${totalAmount.toLocaleString(
        "en-IN"
      )}. Please review and approve this booking request.`,
      meta: { bookingId, tripId: trip.id, type: "organizer" },
    });

    // Booker notification
    await notificationService.sendEmail({
      to: travelerEmail,
      subject: `Booking request submitted: ${tripName}`,
      message: `Your booking request for ${tripName} by ${organizerName} has been submitted. The organizer will review your request and contact you for payment details.`,
      meta: { bookingId, tripId: trip.id, type: "booker" },
    });

    return NextResponse.json({ id: bookingId }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
