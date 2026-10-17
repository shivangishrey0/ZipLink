import crypto from "node:crypto";
import passport from "../config/passport.config.js";
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

const STATE_COOKIE = "oauthState";

const stateCookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax", // lax cookies are still sent when Google redirects the browser back to us
    maxAge: 10 * 60 * 1000,
};

const loginErrorUrl = (code) => `${config.FRONTEND_URL}/login?error=${code}`;

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

export const googleStartController = (req, res, next) => {
    // A random value we also keep in a cookie. Google sends it back, and only the browser that
    // started the login still has the matching cookie.
    const state = crypto.randomBytes(16).toString("hex");

    res.cookie(STATE_COOKIE, state, stateCookieOptions);
    passport.authenticate("google", { scope: ["profile", "email"], session: false, state })(
        req,
        res,
        next
    );
};

export const googleCallbackController = (req, res, next) => {
    const savedState = req.cookies?.[STATE_COOKIE];
    res.clearCookie(STATE_COOKIE, stateCookieOptions);

    if (!savedState || savedState !== req.query.state) {
        return res.redirect(loginErrorUrl("invalid_state"));
    }

    passport.authenticate("google", { session: false }, (error, result, info) => {
        if (error) {
            console.error("Google sign-in failed:", error.message);
            return res.redirect(loginErrorUrl("google_failed"));
        }

        if (!result) {
            return res.redirect(loginErrorUrl(info?.code ?? "google_failed"));
        }

        res.cookie(COOKIE_NAME, result.token, cookieOptions);
        return res.redirect(`${config.FRONTEND_URL}/auth/google/callback`);
    })(req, res, next);
};
