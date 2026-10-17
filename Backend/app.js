import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./src/config/config.js";
import connectDB from "./src/config/mongo.config.js";
import { connectRedis } from "./src/config/redis.config.js";
import { startClickFlush, stopClickFlush } from "./src/services/click.service.js";
import shortUrlRouter from "./src/routes/short_url.route.js"; 
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import analyticsRouter from "./src/routes/analytics.route.js";
import protectedRouter from "./src/routes/protected.route.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/Utils/errorHandler.js";

const app = express();

if (config.TRUST_PROXY) {
    app.set("trust proxy", config.TRUST_PROXY);
}

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/create", shortUrlRouter);
app.use("/api/protected", protectedRouter);
app.get("/:id", redirectFromShortUrl)

app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    connectRedis();
    startClickFlush();

    const server = app.listen(config.PORT, () => {
        console.log(`Server is running on http://localhost:${config.PORT}`);
    });

    // docker stop sends SIGTERM. Write the clicks still waiting in Redis before the process ends.
    const shutdown = async () => {
        server.close();
        await stopClickFlush().catch((error) => console.error("Final click flush failed:", error.message));
        process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
};

startServer();
