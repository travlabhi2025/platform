import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/middleware/auth";
import { adminUserService } from "@/lib/firestore-admin";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    const userProfile = await adminUserService.getUserById(userId);

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: userProfile });
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    const { profile } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    // Update the user document using Admin SDK (bypasses security rules)
    const updatedProfile = await adminUserService.updateUser(userId, profile);

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
