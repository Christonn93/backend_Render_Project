import winston from 'winston';
import expressWinston from 'express-winston';

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [new winston.transports.Console()],
});

const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    colorize: false,
    ignoreRoute: () => process.env.NODE_ENV === 'test',
});

export { logger, requestLogger };
