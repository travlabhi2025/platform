import { NextRequest, NextResponse } from "next/server";
import { verifyAuthAndRole } from "@/lib/middleware/auth";
import { adminUserService } from "@/lib/firestore-admin";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token, check role (block organisers), and get authenticated userId
    const { userId } = await verifyAuthAndRole(request);

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
    // Verify JWT token, check role (block organisers), and get authenticated userId
    const { userId } = await verifyAuthAndRole(request);

    const { profile } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    // SECURITY: Get existing user to verify role cannot be changed
    const existingUser = await adminUserService.getUserById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // SECURITY: Role is permanent and cannot be changed
    if (profile.role !== undefined && profile.role !== existingUser.role) {
      return NextResponse.json(
        { 
          error: "Role cannot be changed. Account roles are permanent once set.",
          code: "ROLE_CHANGE_NOT_ALLOWED"
        },
        { status: 403 }
      );
    }

    // Remove role from update data to ensure it cannot be changed
    const { role, ...profileWithoutRole } = profile;

    // Update the user document using Admin SDK (bypasses security rules)
    // Role is automatically preserved by updateUser function
    const updatedProfile = await adminUserService.updateUser(userId, profileWithoutRole);

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
