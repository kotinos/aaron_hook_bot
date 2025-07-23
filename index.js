/**
 * Discord Hook Bot - Main Entry Point
 * 
 * A comprehensive Discord bot for generating viral content hooks with rate limiting,
 * engagement scoring, and persistent data storage.
 * 
 * @author Aaron (aaronchanlin@gmail.com)
 * @version 1.0.0
 */

import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import cron from 'node-cron';

import { config, validateConfig } from './config/config.js';
import { dbManager } from './database/manager.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main Bot Class
 * Handles initialization, command loading, and graceful shutdown
 */
class HookBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
      ]
    });
    
    this.commands = new Collection();
    this.isShuttingDown = false;
  }

  /**
   * Initialize the bot
   */
  async initialize() {
    try {
      logger.info('🚀 Starting Discord Hook Bot initialization...');
      
      logger.info('📋 Step 1: Validating configuration...');
      validateConfig();
      logger.info('✅ Configuration validated successfully');
      
      logger.info('📋 Step 2: Initializing database...');
      await dbManager.initialize();
      logger.info('✅ Database initialized successfully');
      
      logger.info('📋 Step 3: Loading commands...');
      await this.loadCommands();
      logger.info('✅ Commands loaded successfully');
      
      logger.info('📋 Step 4: Loading events...');
      await this.loadEvents();
      logger.info('✅ Events loaded successfully');
      
      logger.info('📋 Step 5: Registering slash commands...');
      await this.registerCommands();
      logger.info('✅ Slash commands registered successfully');
      
      logger.info('📋 Step 6: Setting up cleanup tasks...');
      this.setupCleanupTasks();
      logger.info('✅ Cleanup tasks scheduled');
      
      logger.info('📋 Step 7: Setting up graceful shutdown...');
      this.setupGracefulShutdown();
      logger.info('✅ Graceful shutdown handlers registered');
      
      logger.info('📋 Step 8: Logging into Discord...');
      await this.client.login(config.discord.token);
      logger.info('🎉 Bot logged in successfully - waiting for ready event...');
      
    } catch (error) {
      logger.error('❌ Bot initialization failed:', error);
      logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      process.exit(1);
    }
  }

  /**
   * Load command modules dynamically
   */
  async loadCommands() {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    this.client.commands = new Collection();
    
    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = await import(filePath);
      
      if ('data' in command && 'execute' in command) {
        this.client.commands.set(command.data.name, command);
        logger.info(`Loaded command: ${command.data.name}`);
      } else {
        logger.warn(`Command at ${filePath} is missing required "data" or "execute" property`);
      }
    }
  }

  /**
   * Load event handlers dynamically
   */
  async loadEvents() {
    const eventsPath = join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = await import(filePath);
      
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }
      
      logger.info(`Loaded event: ${event.name}`);
    }
  }

  /**
   * Register slash commands with Discord
   */
  async registerCommands() {
    const commands = [];
    
    for (const command of this.client.commands.values()) {
      commands.push(command.data.toJSON());
    }
    
    const rest = new REST().setToken(config.discord.token);
    
    try {
      logger.info(`Started refreshing ${commands.length} application (/) commands.`);
      
      const data = await rest.put(
        Routes.applicationCommands(config.discord.clientId || 'auto'),
        { body: commands }
      );
      
      logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      logger.error('Failed to register slash commands:', error);
      throw error;
    }
  }

  /**
   * Setup automated cleanup tasks
   */
  setupCleanupTasks() {
    cron.schedule('0 2 * * *', () => {
      try {
        logger.info('Running daily cleanup tasks...');
        
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
        dbManager.cleanupOldLogs(thirtyDaysAgo);
        
        logger.info('Daily cleanup completed successfully');
      } catch (error) {
        logger.error('Daily cleanup failed:', error);
      }
    });
    
    logger.info('Scheduled daily cleanup at 2:00 AM');
  }

  /**
   * Setup graceful shutdown handlers
   */
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      try {
        logger.info('Destroying Discord client...');
        this.client.destroy();
        
        logger.info('Closing database connection...');
        dbManager.close();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });
  }
}

/**
 * Application Entry Point
 */
async function main() {
  try {
    const bot = new HookBot();
    await bot.initialize();
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default HookBot;
