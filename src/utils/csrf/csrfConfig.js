import { doubleCsrf } from "csrf-csrf";

// this file configures csrf protection using the csrf-csrf library.
const { invalidCsrfTokenError, generateCsrfToken, doubleCsrfProtection } =
    doubleCsrf({
        getSecret: () => process.env.CSRF_SECRET || "tamerElgayar",
        cookieName: "csrf",
        cookieOptions: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        },
        size: 64,
        ignoredMethods: ["GET", "HEAD", "OPTIONS"],
        getTokenFromRequest: (req) => req.headers["x-csrf-token"],
        getSessionIdentifier: (req) => {
            return "1";
        },
    });

export { invalidCsrfTokenError, generateCsrfToken, doubleCsrfProtection };
