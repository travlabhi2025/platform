import { NextRequest, NextResponse } from "next/server";
import { adminUserService } from "@/lib/firestore-admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("[check-organiser] Checking if email is organiser:", email);
    const isOrganiser = await adminUserService.isEmailOrganiser(email);

    return NextResponse.json({ isOrganiser });
  } catch (error) {
    console.error("[check-organiser] Error:", error);
    return NextResponse.json(
      { error: "Failed to check organiser status" },
      { status: 500 }
    );
  }
}
