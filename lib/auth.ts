import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { userService, User } from "./firestore";

// Ensure auth persistence is set exactly once
let persistencePromise: Promise<void> | null = null;
async function ensurePersistence() {
  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).catch(
      (err) => {
        console.error("[auth] Failed to set persistence", err);
        throw err;
      }
    );
  }
  return persistencePromise;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    name: string,
    role: "customer" = "customer",
    phone?: string
  ): Promise<{ authUser: AuthUser; userProfile: User }> {
    await ensurePersistence();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // Parse phone number into countryCode and phone
    let countryCode: string | undefined;
    let phoneNumber: string | undefined;
    
    if (phone) {
      // Phone format from PhoneInput: "+1 123-456-7890" or "+91 1234567890"
      // First, try to match format with space: "+91 1234567890"
      const matchWithSpace = phone.match(/^(\+\d+)\s+(.+)$/);
      if (matchWithSpace) {
        countryCode = matchWithSpace[1];
        phoneNumber = matchWithSpace[2].replace(/\D/g, ""); // Remove non-digits from phone part only
      } else {
        // Try format without space: "+911234567890"
        const matchWithoutSpace = phone.match(/^(\+\d+)(\d+)$/);
        if (matchWithoutSpace) {
          // Find the country code that matches
          const dialCode = matchWithoutSpace[1];
          const remainingDigits = matchWithoutSpace[2];
          
          // Try to find matching country code (handle cases like +1 which could be US or Canada)
          // For now, use the dial code as-is
          countryCode = dialCode;
          phoneNumber = remainingDigits;
        } else {
          // Fallback: try to extract country code from start
          const dialCodeMatch = phone.match(/^(\+\d+)/);
          if (dialCodeMatch) {
            countryCode = dialCodeMatch[1];
            // Remove the country code and any non-digits
            phoneNumber = phone.replace(dialCodeMatch[1], "").replace(/\D/g, "");
          } else {
            // No country code found, store as phone number only
            phoneNumber = phone.replace(/\D/g, "");
          }
        }
      }
    }

    // Create user document in Firestore
    const userProfile = await userService.createOrUpdateUser(
      {
        name,
        email,
        emailVerified: false,
        role,
        contact: {
          email,
          phone: phoneNumber,
          countryCode,
        },
      },
      user.uid
    );

    return {
      authUser: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      userProfile,
    };
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthUser> {
    await ensurePersistence();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(
    callback: (user: FirebaseUser | null) => void
  ): () => void {
    return onAuthStateChanged(auth, callback);
  },

  // Sign in with Google OAuth (popup flow)
  async signInWithGoogle(): Promise<{ firebaseUser: FirebaseUser; userProfile: User }> {
    console.log("[auth] 🚀 Initiating Google OAuth popup...");
    await ensurePersistence();
    
    try {
      console.log("[auth] 📞 Calling signInWithPopup...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("[auth] ✅ Popup successful:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      
      // Check if user profile exists in Firestore
      console.log("[auth] 🔍 Checking for user profile in Firestore...");
      let userProfile = await userService.getUserById(user.uid);
      
      if (!userProfile) {
        // NEW USER - Signup scenario: Create user profile
        console.log("[auth] 👤 New user - creating profile...");
        userProfile = await userService.createOrUpdateUser(
          {
            name: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email || "",
            avatar: user.photoURL || undefined,
            role: "customer",
            emailVerified: user.emailVerified || false,
          },
          user.uid
        );
        console.log("[auth] ✅ Profile created:", {
          id: userProfile.id,
          name: userProfile.name,
        });
      } else {
        console.log("[auth] 👤 Existing user - updating profile if needed...");
        // EXISTING USER - Signin scenario: Update profile if needed
        const updateData: Partial<User> = {};
        
        if (user.displayName && user.displayName !== userProfile.name) {
          updateData.name = user.displayName;
        }
        
        if (user.photoURL && user.photoURL !== userProfile.avatar) {
          updateData.avatar = user.photoURL;
        }
        
        if (user.emailVerified !== userProfile.emailVerified) {
          updateData.emailVerified = user.emailVerified;
        }
        
        if (Object.keys(updateData).length > 0) {
          console.log("[auth] 📝 Updating profile with changes:", updateData);
          userProfile = await userService.createOrUpdateUser(
            {
              ...userProfile,
              ...updateData,
            } as Omit<User, "id" | "createdAt" | "updatedAt">,
            user.uid
          );
          console.log("[auth] ✅ Profile updated");
        } else {
          console.log("[auth] ℹ️ No profile updates needed");
        }
      }

      console.log("[auth] ✅ Returning OAuth result:", {
        hasFirebaseUser: !!user,
        hasUserProfile: !!userProfile,
      });

      return {
        firebaseUser: user,
        userProfile,
      };
    } catch (error: unknown) {
      console.error("[auth] Error signing in with Google:", error);
      throw error;
    }
  },
};
