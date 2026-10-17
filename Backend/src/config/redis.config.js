import { createClient } from "redis";
import config from "./config.js";

let client = null;
let reportedDown = false;

export const connectRedis = () => {
    if (!config.REDIS_URL) {
        console.log("Redis is not configured, caching and rate limits are off.");
        return;
    }

    client = createClient({
        url: config.REDIS_URL,
        // Without this, commands sent while Redis is down wait in a queue and hang the request.
        disableOfflineQueue: true,
        socket: { reconnectStrategy: (retries) => Math.min(retries * 250, 5000) },
    });

    // The client reports every failed reconnect attempt, so log the outage once, not every time.
    client.on("error", (error) => {
        if (!reportedDown) {
            reportedDown = true;
            console.error("Redis is unavailable, falling back to MongoDB:", error.message);
        }
    });

    client.on("ready", () => {
        console.log(reportedDown ? "Redis is back." : "Redis connected.");
        reportedDown = false;
    });

    // Not awaited on purpose: the app must start and serve requests even when Redis is down.
    client.connect().catch(() => {});
};

// Returns the client only while it is connected, so callers can skip Redis with a null check.
export const getRedis = () => (client?.isReady ? client : null);
