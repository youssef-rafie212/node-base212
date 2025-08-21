import redis from "redis";

// initialize redis client
export const initializeRedis = async () => {
    const client = redis.createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
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
