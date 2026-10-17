import express from "express";
import {
    registerController,
    loginController,
    logoutController,
    checkAuthController,
} from "../controller/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/check", requireAuth, checkAuthController);

export default authRouter;
