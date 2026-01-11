import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { adminUserService, adminOtpService, adminNotificationService, adminRateLimitService } from "@/lib/firestore-admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log("[check-email-and-send-otp] Request received for email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email exists by looking in Firestore first (more reliable)
    // Then verify with Admin SDK that the user exists in Firebase Auth
    try {
      console.log("[check-email-and-send-otp] Checking Firestore for user with email:", email);
      const user = await adminUserService.getUserByEmail(email);
      
      if (!user) {
        console.log("[check-email-and-send-otp] User not found in Firestore");
        return NextResponse.json(
          { error: "No account found with this email address. Please sign up first." },
          { status: 404 }
        );
      }

      console.log("[check-email-and-send-otp] User found in Firestore:", {
        userId: user.id,
        email: user.email,
      });

      // Verify user exists in Firebase Auth using Admin SDK
      try {
        const adminAuth = getAdminAuth();
        const firebaseUser = await adminAuth.getUser(user.id);
        console.log("[check-email-and-send-otp] User verified in Firebase Auth:", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        });
      } catch (adminError: any) {
        console.error("[check-email-and-send-otp] Error verifying user in Firebase Auth:", adminError);
        // If user exists in Firestore but not in Auth, that's a data inconsistency
        // But we'll still allow OTP to be sent (they might be able to recover)
        console.warn("[check-email-and-send-otp] User exists in Firestore but not in Auth - proceeding anyway");
      }

      // Check rate limit before sending OTP
      console.log("[check-email-and-send-otp] Checking rate limit for email:", email);
      const rateLimitCheck = await adminRateLimitService.checkRateLimit(email);
      
      if (!rateLimitCheck.allowed) {
        const resetTime = rateLimitCheck.resetAt;
        const minutesUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (60 * 1000));
        console.log("[check-email-and-send-otp] Rate limit exceeded for email:", email);
        return NextResponse.json(
          { 
            error: `Too many OTP requests. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
            rateLimitExceeded: true,
            resetAt: resetTime.toISOString(),
          },
          { status: 429 }
        );
      }
      
      console.log("[check-email-and-send-otp] Rate limit check passed. Remaining requests:", rateLimitCheck.remainingRequests);

      // Record this request for rate limiting
      await adminRateLimitService.recordRequest(email);

      // Email exists, generate and send OTP
      console.log("[check-email-and-send-otp] Generating OTP for email:", email);
      const otp = await adminOtpService.createOTP(email);
      console.log("[check-email-and-send-otp] OTP generated successfully");

      const message = `Your login code for TripAbhi is:\n\n` +
        `${otp}\n\n` +
        `This code will expire in 15 minutes.\n\n` +
        `If you didn't request this code, please ignore this email.`;

      await adminNotificationService.sendEmail({
        to: email,
        subject: "Your login code - TripAbhi",
        message: message,
        meta: { type: "otp-verification" },
      });

      console.log("[check-email-and-send-otp] OTP email sent successfully");
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully to your email" 
      });
    } catch (error: any) {
      console.error("[check-email-and-send-otp] Error checking email:", error);
      console.error("[check-email-and-send-otp] Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      
      if (error.code === "auth/invalid-email") {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to check email. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[check-email-and-send-otp] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
