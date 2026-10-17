import express from "express";
import { unlockUrlController } from "../controller/short_url.controller.js";

const protectedRouter = express.Router();

protectedRouter.post("/:code/unlock", unlockUrlController);

export default protectedRouter;
