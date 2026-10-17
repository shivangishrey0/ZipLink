import { registerService, loginService, toPublicUser } from "../services/auth.service.js";
import { TOKEN_MAX_AGE_MS } from "../Utils/jwtHelper.js";
import config from "../config/config.js";

const COOKIE_NAME = "accessToken";

const cookieOptions = {
    httpOnly: true, // page JavaScript cannot read the token, so XSS cannot steal it
    secure: config.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // not sent on cross-site POSTs, which blocks most CSRF
    maxAge: TOKEN_MAX_AGE_MS,
};

export const registerController = async (req, res) => {
    const { user, token } = await registerService(req.body ?? {});

    res.cookie(COOKIE_NAME, token, cookieOptions);
    return res.status(201).json({ user });
};

export const loginController = async (req, res) => {
    const { user, token } = await loginService(req.body ?? {});

    res.cookie(COOKIE_NAME, token, cookieOptions);
    return res.json({ user });
};

export const logoutController = (req, res) => {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.json({ message: "Logged out." });
};

export const checkAuthController = (req, res) => {
    return res.json({ user: toPublicUser(req.user) });
};
