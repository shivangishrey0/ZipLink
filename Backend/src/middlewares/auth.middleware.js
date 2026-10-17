import { AppError } from "../Utils/errorHandler.js";
import { verifyToken } from "../Utils/jwtHelper.js";
import { findUserById } from "../dao/user.dao.js";
import config from "../config/config.js";

const getUserFromCookie = async (req) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return null;
    }

    try {
        const payload = verifyToken(token);
        return await findUserById(payload.id);
    } catch {
        return null; // bad signature or expired token
    }
};

export const requireAuth = async (req, res, next) => {
    const user = await getUserFromCookie(req);

    if (!user) {
        throw new AppError("Please log in to continue.", 401);
    }

    req.user = user;
    next();
};

export const optionalAuth = async (req, res, next) => {
    req.user = await getUserFromCookie(req);
    next();
};

export const requireGoogleConfig = (req, res, next) => {
    if (!config.GOOGLE_ENABLED) {
        throw new AppError("Google sign-in is not configured.", 503);
    }

    next();
};
