import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token and get authenticated userId
    const { userId } = await verifyAuth(request);

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    return NextResponse.json({ profile: userData });
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

    const userRef = doc(db, "users", userId);

    // Update the user document with the new profile data
    await setDoc(
      userRef,
      {
        ...profile,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
