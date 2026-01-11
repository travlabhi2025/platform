import { NextRequest, NextResponse } from "next/server";
import {
  bookingService,
  notificationService,
  tripService,
  userService,
} from "@/lib/firestore";
import { verifyAuthAndRole, verifyAuth } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token, check role (block organisers), and get authenticated userId
    const { userId } = await verifyAuthAndRole(request);

    // Fetch user profile to determine role
    const userProfile = await userService.getUserById(userId);
    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return bookings for the authenticated customer
    const bookings = await bookingService.getBookingsByEmail(userProfile.email);

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
      packageId,
      travelerName,
      travelerEmail,
      travelerPhone,
      groupSize,
      preferences,
    } = bookingData || {};

    // Try to get authenticated user, but don't fail if not authenticated (guest bookings)
    let userId = null;
    try {
      // If user is authenticated, check role (block organisers)
      const authResult = await verifyAuthAndRole(request);
      userId = authResult.userId;
    } catch {
      // User not authenticated - this is okay for guest bookings
      // Or user is organiser - also treat as unauthenticated for guest flow
      console.log(
        "No authenticated customer user for booking creation - allowing guest booking"
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

    // Calculate total amount based on selected package or fallback to old format
    let totalAmount = 0;
    if (packageId && trip.packages && trip.packages.length > 0) {
      const selectedPackage = trip.packages.find((pkg) => pkg.id === packageId);
      if (selectedPackage) {
        if (selectedPackage.perPerson) {
          totalAmount = selectedPackage.priceInInr * validGroupSize;
        } else {
          totalAmount = selectedPackage.priceInInr;
        }
      } else {
        return NextResponse.json(
          { error: "Selected package not found" },
          { status: 400 }
        );
      }
    } else {
      // Fallback to old format for backward compatibility
      totalAmount = (trip.priceInInr || 0) * validGroupSize;
    }

    // Create booking with essential information
    // Include createdBy if user is logged in (for duplicate prevention)
    const bookingId = await bookingService.createBooking({
      tripId,
      packageId: packageId || undefined, // Include packageId if provided
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

    // Organizer notification (Business owner still needs to know)
    const organizerMessage =
      `You have received a new booking request!\n\n` +
      `Booking Details:\n` +
      `- Traveler: ${travelerName}\n` +
      `- Email: ${travelerEmail}\n` +
      `- Phone: ${travelerPhone}\n` +
      `- Trip: ${tripName}\n` +
      `- Location: ${trip.about?.location || "Various locations"}\n` +
      `- Dates: ${trip.about?.startDate || "TBD"} to ${
        trip.about?.endDate || "TBD"
      }\n` +
      `- Group Size: ${validGroupSize} ${
        validGroupSize === 1 ? "person" : "people"
      }\n` +
      `- Total Amount: ₹${totalAmount.toLocaleString("en-IN")}\n` +
      `${preferences ? `- Preferences: ${preferences}\n` : ""}\n` +
      `Please review this booking request.\n\n` +
      `Booking ID: ${bookingId}`;

    await notificationService.sendEmail({
      to: organizerEmail, // Use actual email, not userId
      subject: `New booking request for ${tripName}`,
      message: organizerMessage,
      meta: { bookingId, tripId: trip.id, type: "organizer" },
    });

    // Customer notification
    const customerMessage =
      `Thank you for your booking request!\n\n` +
      `Your booking request for ${tripName} has been successfully submitted.\n\n` +
      `Booking Details:\n` +
      `- Trip: ${tripName}\n` +
      `- Location: ${trip.about?.location || "Various locations"}\n` +
      `- Dates: ${trip.about?.startDate || "TBD"} to ${
        trip.about?.endDate || "TBD"
      }\n` +
      `- Group Size: ${validGroupSize} ${
        validGroupSize === 1 ? "person" : "people"
      }\n` +
      `- Total Amount: ₹${totalAmount.toLocaleString("en-IN")}\n\n` +
      `You will be contacted shortly with payment details and next steps.\n\n` +
      `You can check your booking status anytime in your dashboard.\n\n` +
      `Thank you for choosing TravlAbhi!`;

    await notificationService.sendEmail({
      to: travelerEmail,
      subject: `Booking request submitted: ${tripName}`,
      message: customerMessage,
      meta: { bookingId, tripId: trip.id, type: "booking-created" },
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
