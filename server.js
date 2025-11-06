import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import https from "https";
import fs from "fs";

import {
    initializeRedis,
    initializeFirebase,
    socketManager,
    initializeJobs,
} from "./src/externalServices/index.js";

dotenv.config();

import app from "./src/app.js";
import { DbConfig, ServerConfig } from "./config/index.js";

// db connection
mongoose
    .connect(DbConfig.dbUri)
    .then(() => {
        console.log("MongoDB connected");

        // initialize cron jobs
        initializeJobs();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// server
let server;

if (ServerConfig.enableHttps) {
    const privateKey = fs.readFileSync(ServerConfig.httpsPrivateKey, "utf8");
    const certificate = fs.readFileSync(ServerConfig.httpsCertificate, "utf8");
    const ca = fs.readFileSync(ServerConfig.httpsCA, "utf8");

    server = https.createServer(
        { key: privateKey, cert: certificate, ca },
        app
    );
} else {
    server = http.createServer(app);
}

// initialize redis
// export const redisClient = await initializeRedis();

// initialize socket handling
export const socketServer = await socketManager.initializeSocket(server, app);

// initialize firebase
initializeFirebase();

// start server
const port = ServerConfig.port;
server.listen(port, () => {
    console.log(`Server is running on port ${port || 3000}`);
});
