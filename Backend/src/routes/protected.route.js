import express from "express";
import { unlockUrlController } from "../controller/short_url.controller.js";
import { unlockLimiter } from "../middlewares/rateLimit.middleware.js";

const protectedRouter = express.Router();

protectedRouter.post("/:code/unlock", unlockLimiter, unlockUrlController);

export default protectedRouter;
