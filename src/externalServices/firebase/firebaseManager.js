import admin from "firebase-admin";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// to avoid using assert
const serviceAccount = require("../../../config/firebase.json");

// initialize firebase admin sdk
export const initializeFirebase = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
};
