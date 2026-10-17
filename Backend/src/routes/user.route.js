import express from "express";
import { getUserUrlsController, updateUserUrlController, deleteUserUrlController } from "../controller/user_url.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.use(requireAuth);

userRouter.get("/urls", getUserUrlsController);
userRouter.put("/urls/:id", updateUserUrlController);
userRouter.delete("/urls/:id", deleteUserUrlController);

export default userRouter;
