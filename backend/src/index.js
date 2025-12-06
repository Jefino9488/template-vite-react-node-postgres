require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { pool } = require('./db/connect');
const apiRouter = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Middleware
 */
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(morgan(process.env.LOG_FORMAT || (NODE_ENV === 'production' ? 'combined' : 'dev')));

app.set('trust proxy', 1); // helpful if behind proxies in production

// Basic rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

/**
 * Routes
 */
app.use('/api', apiRouter);

// Health check route (important for containers / orchestrators)
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1');
        if (result) {
            return res.json({ status: 'ok', database: 'reachable' });
        }
        return res.status(500).json({ status: 'error', database: 'unreachable' });
    } catch (err) {
        console.error('Healthcheck DB error:', err);
        return res.status(500).json({ status: 'error', database: 'unreachable', error: err.message });
    }
});

/**
 * 404 handler (optional)
 */
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Not found' });
});

/**
 * Error handler (centralized)
 */
app.use(errorHandler);

/**
 * Start server
 */
// ... (previous code references)

/**
 * Start server if main module
 */
let server;

if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT} (env: ${NODE_ENV})`);
    });

    /**
     * Graceful shutdown
     */
    const shutdown = async (signal) => {
        console.log(`Received ${signal}. Closing server...`);
        if (server) {
            server.close(async (err) => {
                if (err) {
                    console.error('Error closing server', err);
                    process.exit(1);
                }
                try {
                    await pool.end();
                    console.log('Database pool has ended');
                    process.exit(0);
                } catch (e) {
                    console.error('Error during pool shutdown', e);
                    process.exit(1);
                }
            });
        } else {
            process.exit(0);
        }
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { app };
