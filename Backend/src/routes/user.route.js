import express from "express";
import { getUserUrlsController } from "../controller/user_url.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.use(requireAuth);

userRouter.get("/urls", getUserUrlsController);

export default userRouter;
