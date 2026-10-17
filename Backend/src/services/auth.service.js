import argon2 from "argon2";
import { AppError } from "../Utils/errorHandler.js";
import { signToken } from "../Utils/jwtHelper.js";
import {
    createUser,
    findUserByEmail,
    findUserByEmailWithPassword,
    findUserByGoogleId,
} from "../dao/user.dao.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_KEY = 11000;
const EMAIL_REGISTERED_MESSAGE =
    "This email is already registered with a password. Log in with your password instead.";

// Verified when the email is unknown, so a missing account takes as long as a wrong password.
const DUMMY_HASH = await argon2.hash("dummy-password");

const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
});

const issueToken = (user) => signToken({ id: String(user._id) });

export const registerService = async ({ name, email, password }) => {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 50) {
        throw new AppError("Name is required and must be at most 50 characters.", 400);
    }

    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
        throw new AppError("Enter a valid email address.", 400);
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
        throw new AppError("Password must be 8 to 128 characters.", 400);
    }

    const hash = await argon2.hash(password);

    try {
        const user = await createUser({ name, email, password: hash });
        return { user: toPublicUser(user), token: issueToken(user) };
    } catch (error) {
        if (error.code === DUPLICATE_KEY) {
            throw new AppError("This email is already registered.", 409);
        }
        throw error;
    }
};

export const loginService = async ({ email, password }) => {
    const invalid = new AppError("Invalid email or password.", 401);

    if (typeof email !== "string" || typeof password !== "string") {
        throw invalid;
    }

    const user = await findUserByEmailWithPassword(email.trim().toLowerCase());

    // Google-only accounts have no password, so they can never match here.
    const hash = user?.password ?? DUMMY_HASH;
    const matches = await argon2.verify(hash, password);

    if (!user?.password || !matches) {
        throw invalid;
    }

    return { user: toPublicUser(user), token: issueToken(user) };
};

export const googleLoginService = async ({ googleId, email, name }) => {
    let user = await findUserByGoogleId(googleId);

    if (!user) {
        // Sign-ups here never verify the email. Linking by email would let someone who registered
        // with another person's address take over that person's Google login.
        if (await findUserByEmail(email.toLowerCase())) {
            throw new AppError(EMAIL_REGISTERED_MESSAGE, 409);
        }

        try {
            user = await createUser({ name, email, googleId });
        } catch (error) {
            if (error.code !== DUPLICATE_KEY) {
                throw error;
            }

            // Two callbacks for the same Google account raced, the other one created the user.
            user = await findUserByGoogleId(googleId);

            if (!user) {
                throw new AppError(EMAIL_REGISTERED_MESSAGE, 409);
            }
        }
    }

    return { user: toPublicUser(user), token: issueToken(user) };
};

export { toPublicUser };
