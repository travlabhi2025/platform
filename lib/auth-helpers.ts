import { getAuth } from "firebase/auth";

/**
 * Get authentication headers with Firebase ID token
 * Used by client-side hooks to authenticate API requests
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get fresh ID token from Firebase
  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
