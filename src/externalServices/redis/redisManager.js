import redis from "redis";
import { RedisConfig } from "../../../config/index.js";

// initialize redis client
export const initializeRedis = async () => {
    const client = redis.createClient({
        url: RedisConfig.url,
    });

    client.on("error", (err) => {
        console.error("Redis error:", err);
    });

    client.on("connect", () => {
        console.log("Connected to Redis");
    });

    await client.connect();

    return client;
};
