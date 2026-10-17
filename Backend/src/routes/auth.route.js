import express from "express";
import {
    registerController,
    loginController,
    logoutController,
    checkAuthController,
    googleStartController,
    googleCallbackController,
} from "../controller/auth.controller.js";
import { requireAuth, requireGoogleConfig } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/check", requireAuth, checkAuthController);
authRouter.get("/google", requireGoogleConfig, googleStartController);
authRouter.get("/google/callback", requireGoogleConfig, googleCallbackController);

export default authRouter;
