import admin from "firebase-admin";
import serviceAccount from "../../../config/firebase.json" assert { type: "json" };

export const initializeFirebase = () => {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
        // Path to your Firebase config
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
};
