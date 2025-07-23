import { dbManager } from '../database/manager.js';
import { config } from '../config/config.js';
import { logger } from './logger.js';
import { RateLimitError } from './errorHandler.js';

class RateLimiter {
  constructor() {
    this.windowMs = config.rateLimit.windowHours * 60 * 60 * 1000;
    this.maxRequests = config.rateLimit.requests;
  }

  async checkRateLimit(userId) {
    try {
      const now = Date.now();
      const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
      
      const userRequests = dbManager.getUserRequests(userId);
      
      if (!userRequests) {
        dbManager.insertUserRequest(userId, 1, windowStart);
        logger.info(`New user ${userId} - first request recorded`);
        return {
          allowed: true,
          requestCount: 1,
          remaining: this.maxRequests - 1,
          resetTime: windowStart + this.windowMs
        };
      }

      if (userRequests.window_start < windowStart) {
        dbManager.updateUserRequest(userId, 1, windowStart);
        logger.info(`Rate limit window reset for user ${userId}`);
        return {
          allowed: true,
          requestCount: 1,
          remaining: this.maxRequests - 1,
          resetTime: windowStart + this.windowMs
        };
      }

      if (userRequests.request_count >= this.maxRequests) {
        const resetTime = userRequests.window_start + this.windowMs;
        const timeUntilReset = Math.ceil((resetTime - now) / 1000 / 60);
        
        logger.warn(`Rate limit exceeded for user ${userId}`, {
          requestCount: userRequests.request_count,
          maxRequests: this.maxRequests,
          timeUntilReset
        });
        
        throw new RateLimitError(
          `Rate limit exceeded. You can make ${this.maxRequests} requests every ${config.rateLimit.windowHours} hours. Try again in ${timeUntilReset} minutes.`,
          resetTime
        );
      }

      const newCount = userRequests.request_count + 1;
      dbManager.updateUserRequest(userId, newCount, userRequests.window_start);
      
      logger.info(`Request ${newCount}/${this.maxRequests} for user ${userId}`);
      
      return {
        allowed: true,
        requestCount: newCount,
        remaining: this.maxRequests - newCount,
        resetTime: userRequests.window_start + this.windowMs
      };
      
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      
      logger.error('Rate limit check failed:', error);
      throw new Error('Failed to check rate limit');
    }
  }

  async getUserUsage(userId) {
    try {
      const now = Date.now();
      const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
      
      const userRequests = dbManager.getUserRequests(userId);
      
      if (!userRequests || userRequests.window_start < windowStart) {
        return {
          requestCount: 0,
          remaining: this.maxRequests,
          resetTime: windowStart + this.windowMs
        };
      }
      
      return {
        requestCount: userRequests.request_count,
        remaining: Math.max(0, this.maxRequests - userRequests.request_count),
        resetTime: userRequests.window_start + this.windowMs
      };
      
    } catch (error) {
      logger.error('Failed to get user usage:', error);
      throw new Error('Failed to retrieve usage information');
    }
  }

  formatTimeUntilReset(resetTime) {
    const now = Date.now();
    const diff = resetTime - now;
    
    if (diff <= 0) return 'now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

export const rateLimiter = new RateLimiter();
export default rateLimiter;
