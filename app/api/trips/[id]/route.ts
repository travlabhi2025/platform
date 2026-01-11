import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { tripService } from "@/lib/firestore";
import { verifyAuthAndRole } from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching trip with ID:", tripId);
    const trip = await tripService.getTripById(tripId);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    console.log("Found trip:", JSON.stringify(trip, null, 2));
    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    // Verify JWT token, check role (block organisers), and get authenticated userId
    const { userId } = await verifyAuthAndRole(request);

    const tripData = await request.json();

    console.log("Updating trip with ID:", tripId);
    console.log("Update data:", JSON.stringify(tripData, null, 2));

    // Check if trip exists and user is authorized
    const existingTrip = await tripService.getTripById(tripId);
    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.createdBy !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the trip
    await tripService.updateTrip(tripId, tripData);

    // Revalidate the trip page for SSR
    revalidatePath(`/trip/${tripId}`);
    // Also revalidate the trips listing pages
    revalidatePath("/");
    revalidatePath("/dashboard");

    console.log("Trip updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating trip:", error);

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
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    // Verify JWT token, check role (block organisers), and get authenticated userId
    const { userId } = await verifyAuthAndRole(request);

    console.log("Deleting trip with ID:", tripId);

    // Check if trip exists and user is authorized
    const existingTrip = await tripService.getTripById(tripId);
    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.createdBy !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check for existing bookings before allowing deletion
    const { bookingService } = await import("@/lib/firestore");
    const tripBookings = await bookingService.getBookingsForTrip(tripId);
    const activeBookings = tripBookings.filter(
      (b) => b.status === "Pending" || b.status === "Approved"
    );

    if (activeBookings.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete trip with ${activeBookings.length} active booking(s). Please reject or complete all bookings first.`,
        },
        { status: 400 }
      );
    }

    // Delete the trip
    await tripService.deleteTrip(tripId);

    console.log("Trip deleted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trip:", error);

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
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
