import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';

export const name = Events.Error;

export function execute(error) {
  logger.error('❌ Discord client error:', error);
}
