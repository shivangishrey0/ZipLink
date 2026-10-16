import express from 'express';
import { createShortUrlController } from '../controller/short_url.controller.js';

const ShortUrlRouter = express.Router();

ShortUrlRouter.post("/", createShortUrlController);

export default ShortUrlRouter;