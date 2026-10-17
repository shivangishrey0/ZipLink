import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    APP_URL: process.env.APP_URL,
};

export default config;
