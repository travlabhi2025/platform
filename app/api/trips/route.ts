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
