import { logger } from './logger.js';

export class BotError extends Error {
  constructor(message, type = 'GENERAL', userMessage = null) {
    super(message);
    this.name = 'BotError';
    this.type = type;
    this.userMessage = userMessage || message;
  }
}

export class RateLimitError extends BotError {
  constructor(message, resetTime) {
    super(message, 'RATE_LIMIT');
    this.resetTime = resetTime;
  }
}

export class ValidationError extends BotError {
  constructor(message, field = null) {
    super(message, 'VALIDATION');
    this.field = field;
  }
}

export class DatabaseError extends BotError {
  constructor(message, operation = null) {
    super(message, 'DATABASE');
    this.operation = operation;
  }
}

export function handleError(error, context = 'Unknown') {
  logger.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    type: error.type || 'UNKNOWN',
    context
  });

  if (error instanceof BotError) {
    return {
      userMessage: error.userMessage,
      type: error.type,
      shouldReply: true
    };
  }

  return {
    userMessage: 'An unexpected error occurred. Please try again later.',
    type: 'UNKNOWN',
    shouldReply: true
  };
}

export function createErrorEmbed(error, title = 'Error') {
  const errorInfo = handleError(error);
  
  return {
    color: 0xff0000,
    title: `❌ ${title}`,
    description: errorInfo.userMessage,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'If this error persists, please contact support'
    }
  };
}
