import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/lib/firestore";

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
    const tripData = await request.json();

    // Get user ID from request body
    const userId = tripData.userId;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Remove userId from tripData before saving
    const { userId: _, ...tripDataWithoutUserId } = tripData;

    const tripId = await tripService.createTrip({
      ...tripDataWithoutUserId,
      createdBy: userId,
    });

    return NextResponse.json({ id: tripId }, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
