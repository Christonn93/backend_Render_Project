import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';

import { homeRoute, userRoute, uploadRoute, adminRoute, monitoringRoute } from './routes';
import { errorHandler, apiRateLimiter, attachWebSocketServer } from './middleware';
import { WebSocketServer } from 'ws';

const app = express();

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Attach WebSocket server to all requests
app.use(attachWebSocketServer(wss));

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

/* == Middleware == */

app.use(express.json());

// Apply rate limiting to all routes
app.use(apiRateLimiter);

// Middleware for request logging
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        expressFormat: true,
        colorize: false,
    })
);

// 404 Catch-All Middleware
app.use((req, res) => {
    logger.warn(`404 Not Found - ${req.method} ${req.url}`);
    res.status(404).json({ error: { message: 'Not Found' } });
});

// Error Handling Middleware
app.use(errorHandler);

/* == Routes == */

// Routes
app.use('/', homeRoute);
app.use('/api', uploadRoute);
app.use('/users', userRoute);
app.use('/admin', adminRoute);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/monitoring', monitoringRoute);

/* == Security == */

// Apply security headers
app.use(helmet());
dotenv.config();

// Export both `app` and `wss`
export { app, wss };
export default app;
