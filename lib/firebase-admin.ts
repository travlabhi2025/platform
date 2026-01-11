import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  // Initialize Firebase Admin SDK
  // For server-side use, we can use Application Default Credentials
  // or service account key from environment variable
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined");
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // If service account key is provided as JSON string
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch (parseError) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", parseError);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
    }
  } else {
    // Use Application Default Credentials (for production environments like GCP, Vercel, etc.)
    // This will work if running on GCP, or if GOOGLE_APPLICATION_CREDENTIALS is set
    adminApp = initializeApp({
      projectId,
    });
  }

  return adminApp;
}

export function getAdminAuth(): Auth {
  if (adminAuth) {
    return adminAuth;
  }

  const app = initializeAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

export function getAdminFirestore(): Firestore {
  if (adminDb) {
    return adminDb;
  }

  const app = initializeAdminApp();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const databaseId = "travlabhi"; // Same as client SDK
  
  console.log("[firebase-admin] Initializing Firestore with:", {
    projectId,
    databaseId,
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  });

  // Use the same database name as the client SDK ("travlabhi")
  // For Admin SDK v13+, pass databaseId as second parameter: getFirestore(app, databaseId)
  try {
    // Try with custom database first
    // According to Firebase Admin SDK docs, syntax is: getFirestore(app, databaseId)
    adminDb = getFirestore(app, databaseId);
    
    // Log to verify we're using Admin SDK
    console.log("[firebase-admin] Firestore instance created");
    console.log("[firebase-admin] Instance type:", adminDb.constructor.name);
    console.log("[firebase-admin] Database ID:", (adminDb as any).databaseId || databaseId);
    
    console.log("[firebase-admin] Firestore initialized successfully with database:", databaseId);
    return adminDb;
  } catch (error: any) {
    console.error("[firebase-admin] Error initializing Firestore with custom database:", error);
    console.error("[firebase-admin] Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    
    // If custom database fails, the database might not exist or service account doesn't have access
    // In that case, we should throw a clear error rather than falling back to default
    // because the data is in the custom database
    if (error.code === 5 || error.message.includes("NOT_FOUND")) {
      throw new Error(
        `Firestore database "${databaseId}" not found or not accessible. ` +
        `Please verify the database exists and the service account has proper permissions. ` +
        `Error: ${error.message}`
      );
    }
    
    throw error;
  }
}

export { adminApp };
