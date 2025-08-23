import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import https from "https";
import fs from "fs";

import { initializeSocket } from "./src/services/socket/socketManager.js";
import { initializeRedis } from "./src/services/redis/redisManager.js";
import { initializeFirebase } from "./src/services/firebase/firebaseManager.js";

dotenv.config();

import app from "./src/app.js";

// db connection
mongoose
    .connect(process.env.DB_URI || "mongodb://localhost:27017/base")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// server
let server;

if (process.env.ENABLE_HTTPS === "true") {
    const privateKey = fs.readFileSync(process.env.HTTPS_PRIVATE_KEY, "utf8");
    const certificate = fs.readFileSync(process.env.HTTPS_CERTIFICATE, "utf8");
    const ca = fs.readFileSync(process.env.HTTPS_CA, "utf8");

    server = https.createServer(
        { key: privateKey, cert: certificate, ca },
        app
    );
} else {
    server = http.createServer(app);
}

// start server
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// initialize redis
export const redisClient = await initializeRedis();

// initialize socket handling
export const socketServer = await initializeSocket(server, app);

// initialize firebase
initializeFirebase();
