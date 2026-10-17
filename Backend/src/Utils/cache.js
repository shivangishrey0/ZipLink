import { getRedis } from "../config/redis.config.js";

export const linkCacheKey = (code) => `link:${code}`;

// A cache problem must never break a request, so these helpers swallow Redis errors.
export const cacheGet = async (key) => {
    const redis = getRedis();

    if (!redis) {
        return null;
    }

    try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

export const cacheSet = async (key, value, ttlSeconds) => {
    const redis = getRedis();

    if (!redis) {
        return;
    }

    try {
        await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch {
        // Not cached this time, the next request reads MongoDB again.
    }
};

export const cacheDelete = async (key) => {
    const redis = getRedis();

    if (!redis) {
        return;
    }

    try {
        await redis.del(key);
    } catch {
        // The entry expires on its own when its TTL runs out.
    }
};
