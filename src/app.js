import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import expressRateLimit from "express-rate-limit";
import i18n from "i18n";
import expressFileUpload from "express-fileupload";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import {
    globalErrorHandler,
    apiError,
    initializeRoutes,
} from "./utils/index.js";
import { loggerMiddleware } from "./middlewares/index.js";
import { ServerConfig } from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// i18n configuration
i18n.configure({
    defaultLocale: "ar",
    locales: ["ar", "en"],
    directory: path.join(__dirname, "locales"),
    register: global,
});

// i18n middleware
app.use(i18n.init);

// set language for each request
app.use((req, res, next) => {
    const lang = req.headers.lang || "ar";
    i18n.setLocale(lang);
    req.lang = lang;
    next();
});

// body parser
app.use(express.json());

// parse form data
app.use(express.urlencoded({ extended: true }));

// compression
app.use(compression());

// serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

// cookie parser
app.use(cookieParser());

// logging middleware
app.use(loggerMiddleware);

// cors configuration
app.use(
    cors({
        origin: ServerConfig.allowedOrigins,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);

// xss protection
app.use(xss());

// mongo sanitize
app.use(mongoSanitize());

// express file upload
app.use(expressFileUpload());

// helmet headers
app.use(helmet());

// rate limiting
const limiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 750,
    handler: (req, res) => {
        return res.status(429).send(apiError(429, i18n.__("tooManyRequests")));
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // skip rate limiting for certain paths
        const skipPaths = [
            "/favicon.ico",
            "/robots.txt",
            "/firebase-messaging-sw.js",
            "/manifest.json",
        ];
        return skipPaths.some((p) => req.path.startsWith(p));
    },
});
app.use(limiter);

// common browser requests
const commonBrowserRequests = [
    "/favicon.ico",
    "/firebase-messaging-sw.js",
    "/manifest.json",
    "/service-worker.js",
    "/sw.js",
];

commonBrowserRequests.forEach((request) => {
    app.get(request, (req, res) => {
        if (request === "/favicon.ico") {
            res.status(204).end(); // no content for favicon
        } else {
            res.status(404).end(); // silent 404 for others
        }
    });
});

// standard web files
app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
});

// initialize routes
initializeRoutes(app);

// fallback route (404)
app.use((req, res) => {
    res.status(404).send(apiError(404, i18n.__("notFound")));
});

// global error handler
app.use(globalErrorHandler);

export default app;
