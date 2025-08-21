import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import expressRateLimit from "express-rate-limit";
import i18n from "i18n";
import expressFileUpload from "express-fileupload";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import apiError from "./utils/api/apiError.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import globalErrorHandler from "./utils/error/globalErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRouter from "./routes/api/authRoutes.js";

const app = express();

// Middlewares
i18n.configure({
    defaultLocale: "ar",
    locales: ["ar", "en"],
    directory: path.join(__dirname, "locales"),
    register: global,
});

app.use(i18n.init);

app.use((req, res, next) => {
    const lang = req.headers.lang || "ar";
    i18n.setLocale(lang);
    req.lang = lang;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(morgan("dev"));
app.use(xss());
app.use(mongoSanitize());
app.use(expressFileUpload());
app.use(helmet());
app.use(
    expressRateLimit({
        windowMs: 10 * 60 * 1000,
        max: 100,
    })
);

// API Routes
app.use("/api/v1/auth", authRouter);

// Fallback Route
app.use((req, res) => {
    res.send(apiError(404, i18n.__("notFound")));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
