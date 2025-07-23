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
    guildId: process.env.DISCORD_GUILD_ID
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
  const required = ['DISCORD_BOT_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
}
