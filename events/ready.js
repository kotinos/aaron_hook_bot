import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
  logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
  logger.info(`Bot is in ${client.guilds.cache.size} guilds`);
  
  client.user.setPresence({
    activities: [{
      name: 'Generating viral hooks with /hook enter',
      type: 0
    }],
    status: 'online'
  });
  
  logger.info('Bot presence set successfully');
}
