import argon2 from "argon2";
import { AppError } from "../Utils/errorHandler.js";
import { signToken } from "../Utils/jwtHelper.js";
import { createUser, findUserByEmailWithPassword } from "../dao/user.dao.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_KEY = 11000;

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

export { toPublicUser };
