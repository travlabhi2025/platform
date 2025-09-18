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
    const { userId } = bookingData || {};
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }
    // Compute total on server to trust amount
    const trip = await tripService.getTripById(bookingData.tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const groupSize = Math.max(1, Number(bookingData.groupSize || 1));
    const totalAmount = (trip.priceInInr || 0) * groupSize;

    const bookingId = await bookingService.createBooking({
      ...bookingData,
      totalAmount,
      createdBy: userId,
    });

    // Send fake email notifications (write to notifications collection)
    const organizerName = trip.host?.name || "Organizer";
    const tripName = trip.title || "Trip";
    const travelerName = bookingData.travelerName || "Traveler";

    // Organizer notification
    await notificationService.sendEmail({
      to: trip.createdBy || "organizer@example.com",
      subject: `New booking for ${tripName}`,
      message: `${travelerName} booked the ${tripName} for ${groupSize} people, paid ₹${totalAmount.toLocaleString(
        "en-IN"
      )}`,
      meta: { bookingId, tripId: trip.id, type: "organizer" },
    });

    // Booker notification
    await notificationService.sendEmail({
      to: bookingData.travelerEmail || userId,
      subject: `Booking confirmed: ${tripName}`,
      message: `${tripName} by ${organizerName} has been booked`,
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
