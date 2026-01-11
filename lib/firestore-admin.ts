import { getAdminFirestore } from "./firebase-admin";
import { User } from "./firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * Admin SDK versions of Firestore operations
 * These bypass security rules and should only be used in server-side API routes
 */
export const adminUserService = {
  /**
   * Get user by email using Admin SDK (bypasses security rules)
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = getAdminFirestore();
      console.log(
        "[adminUserService] Querying users collection for email:",
        email
      );
      const usersRef = db.collection("users");
      const snapshot = await usersRef
        .where("email", "==", email)
        .limit(1)
        .get();

      console.log(
        "[adminUserService] Query result - empty:",
        snapshot.empty,
        "docs count:",
        snapshot.docs.length
      );

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = { id: doc.id, ...doc.data() } as User;
      console.log("[adminUserService] User found:", {
        id: userData.id,
        email: userData.email,
      });
      return userData;
    } catch (error: any) {
      console.error("[adminUserService] Error in getUserByEmail:", error);
      console.error("[adminUserService] Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }
  },

  /**
   * Get user by ID using Admin SDK (bypasses security rules)
   */
  async getUserById(userId: string): Promise<User | null> {
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(userId);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as User;
  },

  /**
   * Verify user email using Admin SDK (bypasses security rules)
   */
  async verifyUserEmail(userId: string): Promise<void> {
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      emailVerified: true,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Update user profile using Admin SDK (bypasses security rules)
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(userId);

    // Filter out undefined values - Firestore doesn't accept undefined
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    );

    await userRef.update({
      ...cleanUserData,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Return the updated user profile
    const updatedDoc = await userRef.get();
    if (!updatedDoc.exists) {
      throw new Error("User not found after update");
    }
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  },
};

/**
 * Admin SDK version of OTP operations
 * These bypass security rules and should only be used in server-side API routes
 */
export const adminOtpService = {
  /**
   * Create and store OTP using Admin SDK (bypasses security rules)
   */
  async createOTP(email: string): Promise<string> {
    try {
      const db = getAdminFirestore();
      console.log("[adminOtpService] Creating OTP for email:", email);

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("[adminOtpService] Generated OTP:", otp);

      // Store in firestore with 15 min expiration
      // Use Firestore Timestamp for Admin SDK compatibility
      const expiresAt = Timestamp.fromMillis(Date.now() + 15 * 60 * 1000);

      // Delete any existing OTPs for this email first
      console.log("[adminOtpService] Checking for existing OTPs");
      const otpRef = db.collection("otp_verifications");
      const snapshot = await otpRef.where("email", "==", email).get();

      if (!snapshot.empty) {
        console.log(
          "[adminOtpService] Found",
          snapshot.docs.length,
          "existing OTPs, deleting..."
        );
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("[adminOtpService] Existing OTPs deleted");
      }

      console.log("[adminOtpService] Writing new OTP to Firestore");
      console.log(
        "[adminOtpService] Firestore instance type:",
        db.constructor.name
      );
      console.log(
        "[adminOtpService] Database ID:",
        (db as any).databaseId || "default"
      );

      const docRef = await otpRef.add({
        email,
        otp,
        expiresAt,
        verified: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(
        "[adminOtpService] OTP written successfully, doc ID:",
        docRef.id
      );

      return otp;
    } catch (error: any) {
      console.error("[adminOtpService] Error creating OTP:", error);
      console.error("[adminOtpService] Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack,
      });
      throw error;
    }
  },

  /**
   * Verify OTP using Admin SDK (bypasses security rules)
   */
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const db = getAdminFirestore();
    const otpRef = db.collection("otp_verifications");
    const snapshot = await otpRef
      .where("email", "==", email)
      .where("otp", "==", otp)
      .where("verified", "==", false)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return false;
    }

    const otpDoc = snapshot.docs[0];
    const data = otpDoc.data();

    // Check expiration
    const expiresAt = data.expiresAt?.toDate();
    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      return false;
    }

    // Mark as verified
    await otpDoc.ref.update({
      verified: true,
    });

    return true;
  },
};

// Email template helper (copied from firestore.ts for Admin SDK use)
function createEmailTemplate(
  subject: string,
  message: string,
  type?:
    | "booking-created"
    | "booking-approved"
    | "booking-rejected"
    | "status-change"
    | "otp-verification"
    | undefined
): string {
  const colors = {
    primary: "#0f172a",
    secondary: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  };

  const getHeaderColor = () => {
    switch (type) {
      case "booking-approved":
        return colors.success;
      case "booking-rejected":
        return colors.error;
      case "booking-created":
      case "otp-verification":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: ${getHeaderColor()}; padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TripAbhi</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="color: #1e293b; font-size: 16px; line-height: 1.6;">
                ${message
                  .split("\n")
                  .map((line) => `<p style="margin: 0 0 16px 0;">${line}</p>`)
                  .join("")}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px; text-align: center;">
                This is an automated email from TripAbhi. Please do not reply to this email.
              </p>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} TripAbhi. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Admin SDK version of notification service
 * Uses Admin SDK Firestore to bypass security rules
 */
export const adminNotificationService = {
  async sendEmail(options: {
    to: string;
    subject: string;
    message: string;
    meta?: Record<string, unknown>;
  }): Promise<string> {
    const resendApiKey = process.env.RESEND_API_KEY;
    const db = getAdminFirestore();

    // Always log to Firestore for record-keeping using Admin SDK
    const docRef = await db.collection("notifications").add({
      type: "email",
      to: options.to,
      subject: options.subject,
      message: options.message,
      meta: options.meta ?? {},
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send email via Resend if API key is configured
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const emailType = options.meta?.type as string | undefined;

        const html = createEmailTemplate(
          options.subject,
          options.message,
          emailType as
            | "booking-created"
            | "booking-approved"
            | "booking-rejected"
            | "status-change"
            | "otp-verification"
            | undefined
        );

        await resend.emails.send({
          from: "TripAbhi <noreply@hi.travlabhi.com>",
          to: options.to,
          subject: options.subject,
          html: html,
        });

        console.log(`Email sent successfully to ${options.to}`);
      } catch (error) {
        console.error("Error sending email via Resend:", error);
        // Don't throw - we still want to return the notification ID even if email fails
      }
    } else {
      console.warn(
        "RESEND_API_KEY not configured. Email logged to Firestore only."
      );
    }

    return docRef.id;
  },
};

/**
 * Rate limiting service for OTP requests
 * Tracks OTP requests per email to enforce rate limits
 */
export const adminRateLimitService = {
  /**
   * Check if email has exceeded rate limit (5 requests per 15 minutes)
   * Returns { allowed: boolean, remainingRequests: number, resetAt: Date }
   */
  async checkRateLimit(email: string): Promise<{
    allowed: boolean;
    remainingRequests: number;
    resetAt: Date;
  }> {
    const db = getAdminFirestore();
    const rateLimitRef = db.collection("otp_rate_limits");

    const now = new Date();
    const windowStart = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago

    // Get all requests in the last 15 minutes
    const snapshot = await rateLimitRef
      .where("email", "==", email)
      .where("requestedAt", ">", Timestamp.fromDate(windowStart))
      .orderBy("requestedAt", "desc")
      .get();

    const requestCount = snapshot.docs.length;
    const maxRequests = 5;
    const allowed = requestCount < maxRequests;

    // Find the oldest request in the window to calculate reset time
    let resetAt = new Date(now.getTime() + 15 * 60 * 1000); // Default: 15 minutes from now
    if (!snapshot.empty) {
      const oldestRequest = snapshot.docs[snapshot.docs.length - 1];
      const oldestTimestamp = oldestRequest.data().requestedAt?.toDate();
      if (oldestTimestamp) {
        resetAt = new Date(oldestTimestamp.getTime() + 15 * 60 * 1000);
      }
    }

    return {
      allowed,
      remainingRequests: Math.max(0, maxRequests - requestCount),
      resetAt,
    };
  },

  /**
   * Record an OTP request for rate limiting
   */
  async recordRequest(email: string): Promise<void> {
    const db = getAdminFirestore();
    const rateLimitRef = db.collection("otp_rate_limits");

    await rateLimitRef.add({
      email,
      requestedAt: FieldValue.serverTimestamp(),
    });

    // Clean up old records (older than 15 minutes) in background
    // This is optional but helps keep the collection clean
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 15 * 60 * 1000);

    try {
      const oldRecords = await rateLimitRef
        .where("email", "==", email)
        .where("requestedAt", "<", Timestamp.fromDate(cutoffTime))
        .limit(100)
        .get();

      if (!oldRecords.empty) {
        const batch = db.batch();
        oldRecords.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      // Don't fail the request if cleanup fails
      console.warn(
        "[adminRateLimitService] Failed to cleanup old rate limit records:",
        error
      );
    }
  },
};
