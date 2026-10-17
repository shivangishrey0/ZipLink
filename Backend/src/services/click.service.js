import { getRedis } from "../config/redis.config.js";
import { saveClick, saveClicks } from "../dao/click.dao.js";
import { incrementClicks, incrementClicksByCounts, getExistingUrlIds } from "../dao/short_url.dao.js";

const QUEUE_KEY = "clicks:queue";
const BATCH_SIZE = 500;
const FLUSH_INTERVAL_MS = 5000;

const queueOrSaveClick = async (urlId, device) => {
    const redis = getRedis();

    if (redis) {
        try {
            await redis.rPush(QUEUE_KEY, JSON.stringify({ url: String(urlId), device, at: Date.now() }));
            return;
        } catch {
            // Redis failed just now, fall through and write to MongoDB directly.
        }
    }

    await Promise.all([incrementClicks(urlId), saveClick({ url: urlId, device })]);
};

// Not awaited by callers: counting a click must never slow down or break the redirect.
export const recordClick = (urlId, device) => {
    queueOrSaveClick(urlId, device).catch((error) => {
        console.error("Failed to record click:", error.message);
    });
};

const saveBatch = async (events) => {
    // A link deleted after its clicks were queued must not get orphan click records.
    const existing = new Set(await getExistingUrlIds([...new Set(events.map((event) => event.url))]));
    const live = events.filter((event) => existing.has(event.url));

    if (live.length === 0) {
        return;
    }

    const counts = new Map();
    for (const event of live) {
        counts.set(event.url, (counts.get(event.url) ?? 0) + 1);
    }

    await saveClicks(
        live.map((event) => ({ url: event.url, device: event.device, createdAt: new Date(event.at) }))
    );
    await incrementClicksByCounts(counts);
};

let flushing = false;

export const flushClicks = async () => {
    const redis = getRedis();

    if (!redis || flushing) {
        return 0;
    }

    flushing = true;
    let flushed = 0;

    try {
        while (true) {
            // LPOP removes the batch atomically, so several app copies can flush without double counting.
            const raw = await redis.lPopCount(QUEUE_KEY, BATCH_SIZE);

            if (!raw?.length) {
                break;
            }

            const events = [];
            for (const item of raw) {
                try {
                    events.push(JSON.parse(item));
                } catch {
                    // A corrupt entry would fail the batch forever, so it is dropped.
                }
            }

            try {
                await saveBatch(events);
            } catch (error) {
                // MongoDB failed: put the batch back at the front so nothing is lost, and retry next time.
                await redis.lPush(QUEUE_KEY, [...raw].reverse());
                throw error;
            }

            flushed += raw.length;
        }
    } finally {
        flushing = false;
    }

    return flushed;
};

let timer = null;

export const startClickFlush = () => {
    timer = setInterval(() => {
        flushClicks().catch((error) => console.error("Click flush failed:", error.message));
    }, FLUSH_INTERVAL_MS);
    timer.unref();
};

export const stopClickFlush = async () => {
    clearInterval(timer);
    await flushClicks();
};
