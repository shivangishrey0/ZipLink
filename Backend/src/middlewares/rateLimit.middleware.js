import { getRedis } from "../config/redis.config.js";
import { AppError } from "../Utils/errorHandler.js";

// Fixed window counter: the first request in a window starts the clock, later ones count up.
const rateLimit = ({ name, limit, windowSeconds, getKey = (req) => req.ip }) => {
    return async (req, res, next) => {
        const redis = getRedis();

        if (!redis) {
            return next();
        }

        const key = `rate:${name}:${getKey(req)}`;
        let count;
        let secondsLeft;

        try {
            // One transaction, so a crash cannot leave a counter that never expires. EXPIRE NX sets the
            // expiry only on the first request, later requests do not extend the window.
            [count, , secondsLeft] = await redis.multi().incr(key).expire(key, windowSeconds, "NX").ttl(key).exec();
        } catch {
            // Fail open: a Redis outage should not lock everyone out of logging in.
            return next();
        }

        if (count > limit) {
            res.set("Retry-After", String(secondsLeft));
            throw new AppError(`Too many requests. Try again in ${secondsLeft} seconds.`, 429);
        }

        next();
    };
};

export const authLimiter = rateLimit({ name: "auth", limit: 10, windowSeconds: 15 * 60 });

export const createLimiter = rateLimit({ name: "create", limit: 30, windowSeconds: 60 });

// Per visitor and per link, so guessing one link's password does not block other links.
export const unlockLimiter = rateLimit({
    name: "unlock",
    limit: 10,
    windowSeconds: 15 * 60,
    getKey: (req) => `${req.ip}:${req.params.code}`,
});
