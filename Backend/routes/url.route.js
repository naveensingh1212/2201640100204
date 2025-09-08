// routes/url.route.js
import express from 'express';
import urlController from '../controllers/url.controller.js';

const router = express.Router();

// POST /shorturls
router.post('/', urlController.createShortUrl);

// GET /shorturls/:code
router.get('/:code', urlController.getShortUrlStats);

export default router;