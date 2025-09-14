import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function POST() {
  try {
    await authService.signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
