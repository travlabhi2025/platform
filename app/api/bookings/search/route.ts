import { NextRequest, NextResponse } from "next/server";
import { bookingService, Booking, Trip } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const searchData = await request.json();
    const { email, phone, tripName, hostName } = searchData || {};

    // Validate required fields
    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone number is required" },
        { status: 400 }
      );
    }

    let bookings: Booking[] = [];

    // Search by email if provided
    if (email) {
      const emailBookings = await bookingService.getBookingsByEmail(email);
      bookings = [...bookings, ...emailBookings];
    }

    // Search by phone if provided
    if (phone) {
      const phoneBookings = await bookingService.getBookingsByPhone(phone);
      bookings = [...bookings, ...phoneBookings];
    }

    // Remove duplicates (in case same booking matches both email and phone)
    const uniqueBookings = bookings.filter(
      (booking, index, self) =>
        index === self.findIndex((b) => b.id === booking.id)
    );

    // Apply optional filters
    let filteredBookings = uniqueBookings;

    if (tripName || hostName) {
      // We need to fetch trip details for each booking to apply filters
      const { tripService } = await import("@/lib/firestore");

      const bookingsWithTrips = (await Promise.all(
        filteredBookings.map(async (booking) => {
          const trip = await tripService.getTripById(booking.tripId);
          return { ...booking, trip };
        })
      )) as (Booking & { trip: Trip | null })[];

      filteredBookings = (
        bookingsWithTrips.filter((bookingWithTrip) => {
          const trip = bookingWithTrip.trip;
          if (!trip) return false;

          // Filter by trip name if provided
          if (
            tripName &&
            !trip.title.toLowerCase().includes(tripName.toLowerCase())
          ) {
            return false;
          }

          // Filter by host name if provided
          if (
            hostName &&
            !trip.host?.name?.toLowerCase().includes(hostName.toLowerCase())
          ) {
            return false;
          }

          return true;
        }) as (Booking & { trip: Trip | null })[]
      ).map(({ trip: _trip, ...booking }) => booking);
    }

    return NextResponse.json({
      bookings: filteredBookings,
      count: filteredBookings.length,
    });
  } catch (error) {
    console.error("Error searching bookings:", error);
    return NextResponse.json(
      { error: "Failed to search bookings" },
      { status: 500 }
    );
  }
}
