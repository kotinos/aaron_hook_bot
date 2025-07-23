import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const config = {
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    channelId: process.env.DISCORD_CHANNEL_ID
  },
  database: {
    path: process.env.DATABASE_PATH || './data/bot.db'
  },
  rateLimit: {
    requests: parseInt(process.env.RATE_LIMIT_REQUESTS) || 3,
    windowHours: parseInt(process.env.RATE_LIMIT_WINDOW_HOURS) || 24
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  environment: process.env.NODE_ENV || 'development'
};

export function validateConfig() {
  console.log('🔍 Checking environment variables...');
  console.log('Environment variables present:', {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ? '✅ Present' : '❌ Missing',
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ? '✅ Present' : '❌ Missing',
    DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID ? '✅ Present' : '❌ Missing',
    DATABASE_PATH: process.env.DATABASE_PATH || 'Using default',
    NODE_ENV: process.env.NODE_ENV || 'Using default'
  });
  
  const required = ['DISCORD_BOT_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (!process.env.DISCORD_CLIENT_ID) {
    console.warn('⚠️ DISCORD_CLIENT_ID is missing - slash commands may not register properly');
  }
  
  console.log('✅ All required environment variables are present');
  return true;
}
