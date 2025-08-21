import admin from "firebase-admin";

import serviceAccount from "../../../config/firebase.json" assert { type: "json" };

// initialize firebase admin sdk
export const initializeFirebase = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
};
