import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/firestore";
import { authService } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await bookingService.getBookingsForTrip(params.tripId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching trip bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
