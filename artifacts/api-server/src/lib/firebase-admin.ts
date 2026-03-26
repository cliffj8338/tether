import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initFirebase() {
  if (getApps().length > 0) {
    return getAuth();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      initializeApp({ credential: cert(serviceAccount) });
    } catch {
      console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON, falling back to default credentials");
      initializeApp();
    }
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (projectId) {
      initializeApp({ projectId });
    } else {
      console.warn("No Firebase credentials configured. Firebase auth will not work.");
      return null;
    }
  }

  return getAuth();
}

export const firebaseAuth = initFirebase();

export async function verifyFirebaseToken(idToken: string) {
  if (!firebaseAuth) return null;
  try {
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    return decoded;
  } catch {
    return null;
  }
}
