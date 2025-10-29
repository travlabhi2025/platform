import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { userService, User } from "./firestore";

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
    role: "trip-organizer" | "customer"
  ): Promise<{ authUser: AuthUser; userProfile: User }> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userProfile = await userService.createOrUpdateUser(
      {
        name,
        email,
        verified: false,
        kycVerified: false,
        role,
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

  // Sign in with Google
  async signInWithGoogle(
    role: "trip-organizer" | "customer" = "customer"
  ): Promise<{ authUser: AuthUser; userProfile: User }> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user already exists; if so, do NOT change their role
    const existingProfile = await userService.getUserById(user.uid);

    let userProfile: User;
    if (existingProfile) {
      // Preserve existing profile as-is to avoid accidentally downgrading role
      userProfile = existingProfile;
    } else {
      // New user: create with the specified role (defaults to customer)
      userProfile = await userService.createOrUpdateUser(
        {
          name: user.displayName ?? user.email ?? "",
          email: user.email ?? "",
          avatar: user.photoURL ?? undefined,
          verified: !!user.emailVerified,
          kycVerified: false,
          role: role,
        },
        user.uid
      );
    }

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
};
