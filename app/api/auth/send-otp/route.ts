import { NextRequest, NextResponse } from "next/server";
import { adminOtpService, adminNotificationService, adminRateLimitService } from "@/lib/firestore-admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log("[send-otp] Request received for email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check rate limit before sending OTP
    console.log("[send-otp] Checking rate limit for email:", email);
    const rateLimitCheck = await adminRateLimitService.checkRateLimit(email);
    
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetAt;
      const minutesUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (60 * 1000));
      console.log("[send-otp] Rate limit exceeded for email:", email);
      return NextResponse.json(
        { 
          error: `Too many OTP requests. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
          rateLimitExceeded: true,
          resetAt: resetTime.toISOString(),
        },
        { status: 429 }
      );
    }
    
    console.log("[send-otp] Rate limit check passed. Remaining requests:", rateLimitCheck.remainingRequests);

    // Record this request for rate limiting
    await adminRateLimitService.recordRequest(email);

    // Generate and send OTP using Admin SDK
    console.log("[send-otp] Generating OTP for email:", email);
    const otp = await adminOtpService.createOTP(email);
    console.log("[send-otp] OTP generated successfully");

    const message = `Your verification code for TripAbhi is:\n\n` +
      `${otp}\n\n` +
      `This code will expire in 15 minutes.\n\n` +
      `If you didn't request this code, please ignore this email.`;

    await adminNotificationService.sendEmail({
      to: email,
      subject: "Verify your email - TripAbhi",
      message: message,
      meta: { type: "otp-verification" },
    });

    console.log("[send-otp] OTP email sent successfully");
    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("[send-otp] Error sending OTP:", error);
    console.error("[send-otp] Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}

