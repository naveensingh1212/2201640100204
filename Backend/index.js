// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import geoip from 'geoip-lite';
import urlRoutes from './routes/url.route.js';
import loggingMiddleware from './middleware/logging.js';
import { getStore } from './store.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set Express to trust the proxy for correct IP address detection
app.set('trust proxy', true);

// --- Middleware Chain ---
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// --- API Routes ---
// The API routes are mounted first to handle specific paths like /shorturls
app.use('/shorturls', urlRoutes);

// --- Short Link Redirect Route ---
// This is a generic route that handles all short links
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const store = getStore();
    const entry = store[code];

    if (!entry) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    const now = new Date();
    const expiryDate = new Date(entry.expiry);

    if (now > expiryDate) {
      return res.status(410).json({ error: 'Short link expired' });
    }

    // Get geographical location from IP address
    const geo = geoip.lookup(req.ip) || null;

    // Update click stats and logs
    entry.clicks = (entry.clicks || 0) + 1;
    entry.clickLogs = entry.clickLogs || [];
    entry.clickLogs.push({
      timestamp: now.toISOString(),
      referrer: req.get('referer') || null,
      ip: req.ip || (req.connection && req.connection.remoteAddress) || null,
      geo
    });

    // Redirect to the original URL
    return res.redirect(302, entry.url);
  } catch (err) {
    console.error('redirect error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});