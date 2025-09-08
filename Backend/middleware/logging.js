// middleware/logging.js

export default function loggingMiddleware(req, res, next) {
    const start = Date.now();
    
    // Log request details once the response is sent
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    });

    // Move to the next middleware
    next();
}