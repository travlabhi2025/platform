import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import https from "https";

// Cache for Firebase public keys
let publicKeysCache: { [key: string]: string } | null = null;
let cacheExpiry = 0;

/**
 * Fetch Firebase public keys for JWT verification
 * These keys are used to verify Firebase ID tokens
 */
async function getFirebasePublicKeys(): Promise<{ [key: string]: string }> {
  // Return cached keys if still valid
  if (publicKeysCache && Date.now() < cacheExpiry) {
    return publicKeysCache;
  }

  return new Promise((resolve, reject) => {
    https
      .get(
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              publicKeysCache = JSON.parse(data);

              // Cache keys for 1 hour (Firebase rotates them periodically)
              const cacheControl = res.headers["cache-control"];
              const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
              cacheExpiry =
                Date.now() + (maxAge ? parseInt(maxAge) * 1000 : 3600000);

              resolve(publicKeysCache!);
            } catch (error) {
              reject(new Error("Failed to parse Firebase public keys"));
            }
          });
        }
      )
      .on("error", (error) => {
        reject(
          new Error(`Failed to fetch Firebase public keys: ${error.message}`)
        );
      });
  });
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
  // Extract token from Authorization header
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    throw new Error("Invalid token format");
  }

  try {
    // Decode token header to get the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true });

    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token structure");
    }

    const kid = decodedHeader.header.kid;

    if (!kid) {
      throw new Error("Token missing key ID");
    }

    // Get Firebase public keys
    const publicKeys = await getFirebasePublicKeys();
    const publicKey = publicKeys[kid];

    if (!publicKey) {
      throw new Error("Public key not found for token");
    }

    // Verify token signature and claims
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
    }) as jwt.JwtPayload;

    // Verify token hasn't expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      throw new Error("Token has expired");
    }

    // Extract user information
    return {
      userId: decoded.sub || decoded.user_id,
      email: decoded.email || null,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Token verification failed");
    }
  }
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
