import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { adminUserService, adminOtpService } from "@/lib/firestore-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log("[verify-otp-login] Request received:", { email, otpLength: otp?.length });

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    console.log("[verify-otp-login] Verifying OTP for email:", email);
    const isValid = await adminOtpService.verifyOTP(email, otp);

    if (!isValid) {
      console.log("[verify-otp-login] OTP verification failed - invalid or expired");
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    console.log("[verify-otp-login] OTP verified successfully");

    // OTP is valid, check if user exists in Firestore
    try {
      console.log("[verify-otp-login] Checking Firestore for user with email:", email);
      const user = await adminUserService.getUserByEmail(email);
      
      if (!user) {
        console.log("[verify-otp-login] User not found in Firestore");
        return NextResponse.json(
          { error: "No account found with this email address. Please sign up first." },
          { status: 404 }
        );
      }

      console.log("[verify-otp-login] User found in Firestore:", {
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      });

      // Get Admin Auth to create custom token
      const adminAuth = getAdminAuth();
      
      // The user.id from Firestore should be the Firebase Auth UID
      // This works for both password and Google OAuth users
      // because when users sign up, we store their Firebase Auth UID as the document ID
      const uid = user.id;

      if (!uid) {
        console.error("[verify-otp-login] User found but missing ID");
        return NextResponse.json(
          { error: "User data is invalid" },
          { status: 500 }
        );
      }

      try {
        console.log("[verify-otp-login] Verifying user exists in Firebase Auth with UID:", uid);
        // Verify the user exists in Firebase Auth
        // This will throw if user doesn't exist
        const firebaseUser = await adminAuth.getUser(uid);
        
        console.log("[verify-otp-login] User verified in Firebase Auth:", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          providers: firebaseUser.providerData.map(p => p.providerId),
        });

        console.log("[verify-otp-login] Creating custom token for UID:", uid);
        // Create custom token for the user
        const customToken = await adminAuth.createCustomToken(uid);
        console.log("[verify-otp-login] Custom token created successfully");

        console.log("[verify-otp-login] Updating emailVerified in Firestore");
        // Update emailVerified status in Firestore
        await adminUserService.verifyUserEmail(uid);

        console.log("[verify-otp-login] Updating emailVerified in Firebase Auth");
        // Update emailVerified in Firebase Auth
        if (!firebaseUser.emailVerified) {
          await adminAuth.updateUser(uid, {
            emailVerified: true,
          });
          console.log("[verify-otp-login] Email verified status updated in Firebase Auth");
        } else {
          console.log("[verify-otp-login] Email already verified in Firebase Auth");
        }

        console.log("[verify-otp-login] OTP login successful for user:", uid);
        return NextResponse.json({
          success: true,
          message: "OTP verified successfully",
          customToken,
          userId: uid,
          email: user.email,
        });
      } catch (error: any) {
        console.error("[verify-otp-login] Error creating custom token or updating user:", error);
        console.error("[verify-otp-login] Error details:", {
          message: error.message,
          code: error.code,
          stack: error.stack,
        });
        
        // If user doesn't exist in Auth with this UID, it's a data inconsistency issue
        // This shouldn't happen in normal flow, but we'll handle it gracefully
        return NextResponse.json(
          { error: "Authentication error. Please contact support." },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("[verify-otp-login] Error checking user:", error);
      console.error("[verify-otp-login] Error details:", {
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
        { error: "Failed to verify OTP" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[verify-otp-login] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
