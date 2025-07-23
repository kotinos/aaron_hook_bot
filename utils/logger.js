import winston from 'winston';
import { config } from '../config/config.js';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'discord-hook-bot' },
  transports: [
    new winston.transports.File({ 
      filename: './logs/error.log', 
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: './logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

if (config.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

export default logger;
