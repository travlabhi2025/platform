import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/lib/firestore";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    console.log("Fetching trips for verified user:", userId);
    const trips = await tripService.getTripsByCreator(userId);
    console.log("Found trips:", trips.length, trips);

    // Debug: Log the structure of the first trip
    if (trips.length > 0) {
      console.log("First trip structure:", JSON.stringify(trips[0], null, 2));
    }

    // Transform trips for dashboard display
    const dashboardTrips = trips.map((trip) => {
      try {
        return {
          id: trip.id,
          title: trip.title,
          date:
            trip.about?.startDate ||
            trip.createdAt?.toDate?.()?.toISOString()?.split("T")[0] ||
            "Unknown",
          status: trip.status || "Active",
        };
      } catch (error) {
        console.error("Error transforming trip:", trip, error);
        return {
          id: trip.id || "unknown",
          title: trip.title || "Untitled Trip",
          date: "Unknown",
          status: "Active",
        };
      }
    });

    console.log("Transformed trips for dashboard:", dashboardTrips);
    return NextResponse.json(dashboardTrips);
  } catch (error) {
    console.error("Error fetching user trips:", error);

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
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
