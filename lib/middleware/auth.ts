import { NextRequest } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

// Note: In Edge Runtime, 'https' is not fully supported or needed if we use fetch.
// We'll refactor to use fetch instead of https.
// import https from "https";

// JWKs endpoint for Firebase securetoken
const firebaseJwks = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

/**
 * Verify Firebase ID token string directly
 */
export async function verifyFirebaseIdToken(
  token: string
): Promise<{ userId: string; email: string | null }> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined");
  }

  const { payload } = await jwtVerify(token, firebaseJwks, {
    algorithms: ["RS256"],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });

  return {
    userId: (payload.sub as string) || (payload.user_id as string),
    email: (payload.email as string) || null,
  };
}

/**
 * Verify Firebase ID token and extract user information
 * @param request - Next.js request object
 * @returns User information (userId and email)
 * @throws Error if token is invalid or missing
 */
export async function verifyAuth(
  request: NextRequest
): Promise<{ userId: string; email: string | null }> {
  // Check Authorization Header (Firebase ID Token)
  const authHeader = request.headers.get("Authorization");
  console.log("[middleware] Authorization header present:", !!authHeader);
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1];
    return verifyFirebaseIdToken(token);
  }

  throw new Error("No valid authentication found");
}

/**
 * Optional: Helper to verify auth and return error response if failed
 */
export async function verifyAuthOrFail(request: NextRequest) {
  try {
    return await verifyAuth(request);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return {
      error: true,
      status: 401,
      message,
    };
  }
}
