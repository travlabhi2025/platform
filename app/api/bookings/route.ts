import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";
import { authService } from "@/lib/auth";

export async function GET() {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await bookingService.getBookingsByUser(user.uid);
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
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingData = await request.json();
    const bookingId = await bookingService.createBooking({
      ...bookingData,
      createdBy: user.uid,
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
