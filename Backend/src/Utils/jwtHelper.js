import jwt from "jsonwebtoken";
import config from "../config/config.js";

const TOKEN_DAYS = 7;

export const TOKEN_MAX_AGE_MS = TOKEN_DAYS * 24 * 60 * 60 * 1000;

export const signToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
};

export const verifyToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};
