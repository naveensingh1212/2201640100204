
    import validUrl from 'valid-url';
    import { getStore } from '../store.js';
    import { generateShortCode } from '../utils/shortid.js';
 
    import Log from '../utils/logMiddleware.js';

    // Config
    const DEFAULT_MIN = Number(process.env.DEFAULT_VALIDITY_MIN || 30);
    const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
    const MAX_SHORTCODE_GENERATION_ATTEMPTS = 5;

    const isValidShortcode = (code) => /^[0-9A-Za-z_-]{3,50}$/.test(code);

    const validateUrlInput = (url) => {
    if (!url || typeof url !== 'string') return 'URL is required and must be a string';
    if (!validUrl.isWebUri(url)) return 'Invalid URL format';
    return null;
    };

    const parseValidity = (validity) => {
    if (validity === undefined || validity === null || validity === '') return DEFAULT_MIN;
    const parsed = parseInt(validity, 10);
    if (Number.isNaN(parsed) || parsed <= 0) return null;
    return parsed;
    };

    const generateUniqueShortcode = (store) => {
    let code = generateShortCode();
    let attempts = 0;
    while (store[code] && attempts < MAX_SHORTCODE_GENERATION_ATTEMPTS) {
        code = generateShortCode();
        attempts++;
    }
    if (store[code]) throw new Error('Failed to generate unique shortcode');
    return code;
    };

    // --- Controllers ---
    const createShortUrl = async (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;

        // 1. Validate URL
        const urlError = validateUrlInput(url);
        if (urlError) {
        try { await Log?.('backend', 'error', 'controller', `createShortUrl - ${urlError}`); } catch {}
        return res.status(400).json({ success: false, error: urlError, field: 'url' });
        }

        // 2. Validate validity
        const validityMinutes = parseValidity(validity);
        if (validityMinutes === null) {
        return res.status(400).json({ success: false, error: 'Validity must be a positive integer (minutes)', field: 'validity' });
        }

        const expiryDate = new Date(Date.now() + validityMinutes * 60 * 1000);
        const expiryIso = expiryDate.toISOString();

        const store = getStore();
        let finalShortcode;

        // 3. Handle shortcode
        if (shortcode) {
        const trimmed = String(shortcode).trim();
        if (!isValidShortcode(trimmed)) {
            return res.status(400).json({ success: false, error: 'Invalid shortcode format', field: 'shortcode' });
        }
        if (store[trimmed]) {
            return res.status(409).json({ success: false, error: 'Shortcode already in use', field: 'shortcode' });
        }
        finalShortcode = trimmed;
        } else {
        finalShortcode = generateUniqueShortcode(store);
        }

        // 4. Save entry
        store[finalShortcode] = {
        url,
        createdAt: new Date().toISOString(),
        expiry: expiryIso,
        clicks: 0,
        clickLogs: []
        };

        try { await Log?.('backend', 'info', 'controller', `Short URL created: ${finalShortcode}`); } catch {}

        return res.status(201).json({
        success: true,
        shortLink: `${BASE_URL}/${finalShortcode}`,
        shortcode: finalShortcode,
        originalUrl: url,
        expiresAt: expiryIso,
        validityMinutes
        });
    } catch (err) {
        console.error('createShortUrl error:', err);
        try { await Log?.('backend', 'fatal', 'controller', `createShortUrl - exception: ${err.message}`); } catch {}
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
    };

    const getShortUrlStats = async (req, res) => {
    try {
        const { code } = req.params;
        if (!code || !isValidShortcode(code)) {
        return res.status(400).json({ success: false, error: 'Invalid shortcode', field: 'code' });
        }

        const store = getStore();
        const entry = store[code];
        if (!entry) return res.status(404).json({ success: false, error: 'Shortcode not found' });

        const isExpired = new Date() > new Date(entry.expiry);

        return res.status(200).json({
        success: true,
        data: {
            url: entry.url,
            shortcode: code,
            createdAt: entry.createdAt,
            expiresAt: entry.expiry,
            isExpired,
            totalClicks: entry.clicks,
            clickHistory: entry.clickLogs,
            shortLink: `${BASE_URL}/${code}`
        }
        });
    } catch (err) {
        console.error('getShortUrlStats error:', err);
        try { await Log?.('backend', 'fatal', 'controller', `getShortUrlStats - exception: ${err.message}`); } catch {}
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
    };

   
    export default {
    createShortUrl,
    getShortUrlStats
    };
