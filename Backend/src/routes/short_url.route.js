import express from 'express';
import { createShortUrlController } from '../controller/short_url.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const ShortUrlRouter = express.Router();

ShortUrlRouter.post("/", optionalAuth, createShortUrlController);

export default ShortUrlRouter;