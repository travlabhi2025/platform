import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authService.signIn(email, password);
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error signing in:", error);

    let errorMessage = "Failed to sign in";
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Wrong password";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later";
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
