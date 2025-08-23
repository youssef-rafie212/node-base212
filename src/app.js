import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import expressRateLimit from "express-rate-limit";
import i18n from "i18n";
import expressFileUpload from "express-fileupload";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

import apiError from "./utils/api/apiError.js";
import globalErrorHandler from "./utils/error/globalErrorHandler.js";
import authRouter from "./routes/api/authRoutes.js";
import userRouter from "./routes/api/userRoutes.js";
import morgan from "morgan";

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

// serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

// cookie parser
app.use(cookieParser());

// cors configuration
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);

// logging middleware
app.use(morgan("dev"));

// xss protection
app.use(xss());

// mongo sanitize
app.use(mongoSanitize());

// express file upload
app.use(expressFileUpload());

// helmet headers
app.use(helmet());

// rate limiting
app.use(
    expressRateLimit({
        windowMs: 60 * 1000,
        max: 50,
    })
);

// api routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRouter);

// fallback route (404)
app.use((req, res) => {
    res.status(404).send(apiError(404, i18n.__("notFound")));
});

// global error handler
app.use(globalErrorHandler);

export default app;
