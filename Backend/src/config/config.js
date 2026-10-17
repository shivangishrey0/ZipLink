import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "APP_URL"];

for (const name of required) {
    if (!process.env[name]) {
        throw new Error(`Missing environment variable: ${name}`);
    }
}

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    APP_URL: process.env.APP_URL,
};

export default config;
