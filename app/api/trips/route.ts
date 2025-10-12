import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/lib/firestore";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET() {
  try {
    const trips = await tripService.getAllTrips();
    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    const tripData = await request.json();

    const tripId = await tripService.createTrip({
      ...tripData,
      createdBy: userId,
    });

    return NextResponse.json({ id: tripId }, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);

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
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
