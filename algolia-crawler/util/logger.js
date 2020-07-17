// Include the logger module
const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: '' }),
        timestamp(),
        logFormat
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new(winston.transports.DailyRotateFile)({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            handleExceptions: true,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '5d'
        }),
        new(winston.transports.DailyRotateFile)({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '5d'
        })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            label({ label: '' }),
            timestamp(),
            logFormat
        )
    }));
}

// Add log command
logger.log = logger.info;

module.exports = logger;