import express from 'express';
import { createShortUrlController } from '../controller/short_url.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { createLimiter } from '../middlewares/rateLimit.middleware.js';

const ShortUrlRouter = express.Router();

ShortUrlRouter.post("/", createLimiter, optionalAuth, createShortUrlController);

export default ShortUrlRouter;