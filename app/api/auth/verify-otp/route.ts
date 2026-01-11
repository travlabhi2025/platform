import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { adminOtpService, adminUserService } from "@/lib/firestore-admin";
import { verifyAuth } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log("[verify-otp] Request received:", { email, otpLength: otp?.length });

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP using Admin SDK
    console.log("[verify-otp] Verifying OTP for email:", email);
    const isValid = await adminOtpService.verifyOTP(email, otp);

    if (!isValid) {
      console.log("[verify-otp] Invalid or expired OTP");
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    console.log("[verify-otp] OTP verified successfully");

    // Try to find the user to update their verification status
    let userId: string | null = null;

    // 1. Try from Auth Token (most secure)
    try {
      const authResult = await verifyAuth(request);
      userId = authResult.userId;
      console.log("[verify-otp] User ID from auth token:", userId);
    } catch {
      console.log(
        "[verify-otp] User not authenticated via token during OTP verify, trying fallback..."
      );
    }

    // 2. Fallback: Find user by email using Admin SDK
    if (!userId) {
      console.log("[verify-otp] Looking up user by email using Admin SDK");
      const user = await adminUserService.getUserByEmail(email);
      if (user && user.id) {
        userId = user.id;
        console.log("[verify-otp] User found by email:", userId);
      }
    }

    // 3. Update User Profile and Firebase Auth emailVerified status
    if (userId) {
      console.log("[verify-otp] Updating email verification status for user:", userId);
      
      // Update Firestore
      await adminUserService.verifyUserEmail(userId);
      console.log("[verify-otp] Email verified in Firestore");

      // Update Firebase Auth
      try {
        const adminAuth = getAdminAuth();
        const firebaseUser = await adminAuth.getUser(userId);
        if (!firebaseUser.emailVerified) {
          await adminAuth.updateUser(userId, { emailVerified: true });
          console.log("[verify-otp] Email verified status updated in Firebase Auth");
        } else {
          console.log("[verify-otp] Email already verified in Firebase Auth");
        }
      } catch (authError: any) {
        console.error("[verify-otp] Error updating Firebase Auth:", authError);
        // Don't fail the request if Auth update fails - Firestore update is sufficient
      }

      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    } else {
      console.error("[verify-otp] OTP verified but user profile not found");
      return NextResponse.json(
        { error: "OTP verified but user profile not found." },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("[verify-otp] Error verifying OTP:", error);
    console.error("[verify-otp] Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
