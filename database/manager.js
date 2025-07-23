import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  constructor() {
    this.db = null;
    this.prepared = {};
  }

  async initialize() {
    try {
      const dbPath = path.resolve(config.database.path);
      const dbDir = path.dirname(dbPath);
      
      await import('fs').then(fs => {
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
      });

      this.db = new Database(dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = memory');

      await this.runSchema();
      await this.prepareStatements();
      
      logger.info('Database initialized successfully', { path: dbPath });
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw new DatabaseError('Database initialization failed', 'INIT');
    }
  }

  async runSchema() {
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf8');
      this.db.exec(schema);
      logger.info('Database schema applied successfully');
    } catch (error) {
      logger.error('Failed to apply database schema:', error);
      throw new DatabaseError('Schema application failed', 'SCHEMA');
    }
  }

  async prepareStatements() {
    try {
      this.prepared = {
        getUserRequests: this.db.prepare(`
          SELECT * FROM user_requests WHERE user_id = ?
        `),
        
        insertUserRequest: this.db.prepare(`
          INSERT INTO user_requests (user_id, request_count, window_start)
          VALUES (?, ?, ?)
        `),
        
        updateUserRequest: this.db.prepare(`
          UPDATE user_requests 
          SET request_count = ?, window_start = ?, updated_at = strftime('%s', 'now')
          WHERE user_id = ?
        `),
        
        insertRequestLog: this.db.prepare(`
          INSERT INTO request_logs (user_id, context, hooks_generated, success, error_message, execution_time_ms)
          VALUES (?, ?, ?, ?, ?, ?)
        `),
        
        getUserStats: this.db.prepare(`
          SELECT 
            COUNT(*) as total_requests,
            SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_requests,
            AVG(execution_time_ms) as avg_execution_time
          FROM request_logs 
          WHERE user_id = ?
        `),
        
        getRecentLogs: this.db.prepare(`
          SELECT * FROM request_logs 
          WHERE created_at > ? 
          ORDER BY created_at DESC 
          LIMIT ?
        `),
        
        cleanupOldLogs: this.db.prepare(`
          DELETE FROM request_logs 
          WHERE created_at < ?
        `)
      };
      
      logger.info('Database prepared statements created successfully');
    } catch (error) {
      logger.error('Failed to prepare database statements:', error);
      throw new DatabaseError('Statement preparation failed', 'PREPARE');
    }
  }

  getUserRequests(userId) {
    try {
      return this.prepared.getUserRequests.get(userId);
    } catch (error) {
      logger.error('Failed to get user requests:', error);
      throw new DatabaseError('Failed to retrieve user requests', 'GET_USER_REQUESTS');
    }
  }

  insertUserRequest(userId, requestCount, windowStart) {
    try {
      return this.prepared.insertUserRequest.run(userId, requestCount, windowStart);
    } catch (error) {
      logger.error('Failed to insert user request:', error);
      throw new DatabaseError('Failed to insert user request', 'INSERT_USER_REQUEST');
    }
  }

  updateUserRequest(userId, requestCount, windowStart) {
    try {
      return this.prepared.updateUserRequest.run(requestCount, windowStart, userId);
    } catch (error) {
      logger.error('Failed to update user request:', error);
      throw new DatabaseError('Failed to update user request', 'UPDATE_USER_REQUEST');
    }
  }

  insertRequestLog(userId, context, hooksGenerated, success, errorMessage, executionTime) {
    try {
      return this.prepared.insertRequestLog.run(
        userId, 
        context, 
        hooksGenerated, 
        success ? 1 : 0, 
        errorMessage, 
        executionTime
      );
    } catch (error) {
      logger.error('Failed to insert request log:', error);
      throw new DatabaseError('Failed to log request', 'INSERT_LOG');
    }
  }

  getUserStats(userId) {
    try {
      return this.prepared.getUserStats.get(userId);
    } catch (error) {
      logger.error('Failed to get user stats:', error);
      throw new DatabaseError('Failed to retrieve user statistics', 'GET_USER_STATS');
    }
  }

  getRecentLogs(sinceTimestamp, limit = 100) {
    try {
      return this.prepared.getRecentLogs.all(sinceTimestamp, limit);
    } catch (error) {
      logger.error('Failed to get recent logs:', error);
      throw new DatabaseError('Failed to retrieve recent logs', 'GET_RECENT_LOGS');
    }
  }

  cleanupOldLogs(beforeTimestamp) {
    try {
      const result = this.prepared.cleanupOldLogs.run(beforeTimestamp);
      logger.info(`Cleaned up ${result.changes} old log entries`);
      return result;
    } catch (error) {
      logger.error('Failed to cleanup old logs:', error);
      throw new DatabaseError('Failed to cleanup old logs', 'CLEANUP_LOGS');
    }
  }

  close() {
    try {
      if (this.db) {
        this.db.close();
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Failed to close database:', error);
    }
  }

  transaction(fn) {
    try {
      return this.db.transaction(fn)();
    } catch (error) {
      logger.error('Transaction failed:', error);
      throw new DatabaseError('Database transaction failed', 'TRANSACTION');
    }
  }
}

export const dbManager = new DatabaseManager();
export default dbManager;
