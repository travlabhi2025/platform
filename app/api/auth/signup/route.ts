import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const user = await authService.signUp(email, password, name);
    return NextResponse.json({ user }, { status: 201 });
    } catch (error: unknown) {
    console.error("Error signing up:", error);

    let errorMessage = "Failed to sign up";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "auth/email-already-in-use") {
      errorMessage = "Email already in use";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((error as any).code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((error as any).code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
