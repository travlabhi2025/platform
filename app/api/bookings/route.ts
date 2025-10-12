import { NextRequest, NextResponse } from "next/server";
import {
  bookingService,
  notificationService,
  tripService,
  userService,
} from "@/lib/firestore";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    // Fetch user profile to determine role
    const userProfile = await userService.getUserById(userId);
    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let bookings;
    if (userProfile.role === "trip-organizer") {
      // For organizers: return bookings for their trips
      bookings = await bookingService.getBookingsForOrganizer(userId);
    } else {
      // For customers: return their own bookings by email
      bookings = await bookingService.getBookingsByEmail(userProfile.email);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);

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

    // Try to get authenticated user, but don't fail if not authenticated (guest bookings)
    let userId = null;
    let userProfile = null;
    try {
      const authResult = await verifyAuth(request);
      userId = authResult.userId;

      // Fetch user profile to check role
      if (userId) {
        userProfile = await userService.getUserById(userId);
      }
    } catch (error) {
      // User not authenticated - this is okay for guest bookings
      console.log(
        "No authenticated user for booking creation - allowing guest booking"
      );
    }

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

    // Check if authenticated user is a trip organizer
    if (userProfile && userProfile.role === "trip-organizer") {
      return NextResponse.json(
        {
          error:
            "Trip organizers cannot book trips. Please use a customer account to make bookings.",
          code: "ORGANIZER_BOOKING_NOT_ALLOWED",
        },
        { status: 403 }
      );
    }

    // Get trip details to calculate total amount
    const trip = await tripService.getTripById(tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // SERVER-SIDE DUPLICATE CHECK
    // Check if user has already booked this trip
    if (userId) {
      const hasExistingBooking = await bookingService.hasUserBookedTrip(
        userId,
        tripId
      );
      if (hasExistingBooking) {
        // Get existing booking details for better error message
        const existingBooking = await bookingService.getUserBookingForTrip(
          userId,
          tripId
        );
        return NextResponse.json(
          {
            error: "You have already booked this trip",
            existingBooking: existingBooking
              ? {
                  id: existingBooking.id,
                  status: existingBooking.status,
                  bookingDate: existingBooking.bookingDate,
                  totalAmount: existingBooking.totalAmount,
                }
              : null,
          },
          { status: 409 } // Conflict status code
        );
      }
    }

    // For guest users, check by email to prevent spam
    if (!userId) {
      const existingGuestBooking = await bookingService.hasEmailBookedTrip(
        travelerEmail,
        tripId
      );
      if (existingGuestBooking) {
        return NextResponse.json(
          { error: "A booking with this email already exists for this trip" },
          { status: 409 }
        );
      }
    }

    const validGroupSize = Math.max(1, Number(groupSize || 1));
    const totalAmount = (trip.priceInInr || 0) * validGroupSize;

    // Create booking with essential information
    // Include createdBy if user is logged in (for duplicate prevention)
    const bookingId = await bookingService.createBooking({
      tripId,
      travelerName,
      travelerEmail,
      travelerPhone,
      groupSize: validGroupSize,
      preferences: preferences || "",
      totalAmount,
      status: "Pending",
      ...(userId && { createdBy: userId }), // Add createdBy only if userId exists
    });

    // Send email notifications
    const organizerName = trip.host?.name || "Organizer";
    const tripName = trip.title || "Trip";

    // Fetch organizer profile to get actual email
    const organizerProfile = await userService.getUserById(trip.createdBy);
    const organizerEmail = organizerProfile?.email || "support@travlabhi.com";

    // Organizer notification
    await notificationService.sendEmail({
      to: organizerEmail, // Use actual email, not userId
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
