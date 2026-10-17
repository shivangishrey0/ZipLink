import { AppError } from "../Utils/errorHandler.js";
import { findUrlByCodeAndUser } from "../dao/short_url.dao.js";
import { getDailyClicks, getDeviceClicks } from "../dao/click.dao.js";
import { toPublicUrl } from "./short_url.service.js";

const DAYS = 30;

// Midnight UTC, DAYS - 1 days ago. Mongo groups by UTC date, so the series uses UTC too.
const getRangeStart = () => {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - (DAYS - 1));
    return start;
};

// Days with no clicks are not in the aggregation result, but a chart needs them as zeros.
const buildDailySeries = (start, rows) => {
    const counts = new Map(rows.map((row) => [row._id, row.clicks]));
    const series = [];

    for (let i = 0; i < DAYS; i++) {
        const day = new Date(start);
        day.setUTCDate(start.getUTCDate() + i);
        const date = day.toISOString().slice(0, 10);
        series.push({ date, clicks: counts.get(date) ?? 0 });
    }

    return series;
};

export const getAnalyticsService = async (code, userId) => {
    const link = await findUrlByCodeAndUser(code, userId);

    if (!link) {
        throw new AppError("URL not found", 404);
    }

    const start = getRangeStart();

    const [dailyRows, deviceRows] = await Promise.all([
        getDailyClicks(link._id, start),
        getDeviceClicks(link._id),
    ]);

    return {
        link: toPublicUrl(link),
        totalClicks: link.clicks,
        daily: buildDailySeries(start, dailyRows),
        devices: deviceRows.map((row) => ({ device: row._id, clicks: row.clicks })),
    };
};
