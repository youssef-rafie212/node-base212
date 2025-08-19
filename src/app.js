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
import apiError from "./helpers/api/apiError.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public"));
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

// i18n
i18n.configure({
    defaultLocale: "ar",
    locales: ["ar", "en"],
    directory: "./locales",
});
app.use(i18n.init);
app.use((req, res, next) => {
    const lang = req.headers.lang || "ar";
    i18n.setLocale(req, lang);
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.send(
        apiError(err.status || 500, err.message || "Internal Server Error")
    );
});

export default app;
