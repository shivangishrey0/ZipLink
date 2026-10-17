import { AppError } from "./errorHandler.js";

const parseDate = (value, name) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new AppError(`${name} is not a valid date.`, 400);
    }

    return date;
};

export const validateDates = (activeFrom, expiresAt) => {
    const dates = {};

    if (activeFrom) {
        dates.activeFrom = parseDate(activeFrom, "activeFrom");
    }

    if (expiresAt) {
        dates.expiresAt = parseDate(expiresAt, "expiresAt");

        if (dates.expiresAt <= new Date()) {
            throw new AppError("expiresAt must be in the future.", 400);
        }
    }

    if (dates.activeFrom && dates.expiresAt && dates.activeFrom >= dates.expiresAt) {
        throw new AppError("activeFrom must be before expiresAt.", 400);
    }

    return dates;
};
