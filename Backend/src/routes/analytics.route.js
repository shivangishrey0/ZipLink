import express from "express";
import { getAnalyticsController } from "../controller/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/:code", requireAuth, getAnalyticsController);

export default analyticsRouter;
