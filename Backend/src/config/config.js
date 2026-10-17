import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "APP_URL", "JWT_SECRET"];

for (const name of required) {
    if (!process.env[name]) {
        throw new Error(`Missing environment variable: ${name}`);
    }
}

const googleSettings = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
];

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_ENABLED: googleSettings.every(Boolean),
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    APP_URL: process.env.APP_URL?.replace(/\/+$/, ""),
    FRONTEND_URL: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, ""),
};

export default config;
