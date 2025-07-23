import { SlashCommandBuilder } from 'discord.js';
import { hookGenerator } from '../hooks/generator.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { dbManager } from '../database/manager.js';
import { logger } from '../utils/logger.js';
import { createErrorEmbed, ValidationError, RateLimitError } from '../utils/errorHandler.js';

export const data = new SlashCommandBuilder()
  .setName('hook')
  .setDescription('Generate viral content hooks')
  .addSubcommand(subcommand =>
    subcommand
      .setName('enter')
      .setDescription('Generate 10 viral content hooks based on your context')
      .addStringOption(option =>
        option
          .setName('context')
          .setDescription('The topic or context for your content hooks (3-500 characters)')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  const startTime = Date.now();
  const userId = interaction.user.id;
  const context = interaction.options.getString('context');
  
  try {
    await interaction.deferReply({ ephemeral: true });
    
    logger.info(`Hook command executed by user ${userId} with context: "${context}"`);
    
    const rateLimitResult = await rateLimiter.checkRateLimit(userId);
    
    const hooks = hookGenerator.generateHooks(context);
    
    const formattedHooks = hookGenerator.formatHooksForDiscord(hooks);
    
    const usageInfo = `\n📊 **Usage**: ${rateLimitResult.requestCount}/${rateLimiter.maxRequests} requests used | ${rateLimitResult.remaining} remaining`;
    const resetInfo = `⏰ **Resets**: ${rateLimiter.formatTimeUntilReset(rateLimitResult.resetTime)}`;
    
    const fullMessage = formattedHooks + usageInfo + '\n' + resetInfo;
    
    if (fullMessage.length > 2000) {
      const truncatedHooks = hooks.slice(0, 8);
      const truncatedFormatted = hookGenerator.formatHooksForDiscord(truncatedHooks);
      const truncatedMessage = truncatedFormatted + '\n\n⚠️ *Response truncated to fit Discord limits*' + usageInfo + '\n' + resetInfo;
      
      await interaction.editReply({
        content: truncatedMessage
      });
    } else {
      await interaction.editReply({
        content: fullMessage
      });
    }
    
    const executionTime = Date.now() - startTime;
    
    dbManager.insertRequestLog(
      userId,
      context,
      hooks.length,
      true,
      null,
      executionTime
    );
    
    logger.info(`Successfully generated ${hooks.length} hooks for user ${userId} in ${executionTime}ms`);
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    logger.error(`Hook command failed for user ${userId}:`, error);
    
    try {
      dbManager.insertRequestLog(
        userId,
        context || 'unknown',
        0,
        false,
        error.message,
        executionTime
      );
    } catch (dbError) {
      logger.error('Failed to log error to database:', dbError);
    }
    
    if (error instanceof RateLimitError) {
      const embed = {
        color: 0xff9900,
        title: '⏰ Rate Limit Exceeded',
        description: error.message,
        fields: [
          {
            name: 'Reset Time',
            value: rateLimiter.formatTimeUntilReset(error.resetTime),
            inline: true
          }
        ],
        timestamp: new Date().toISOString()
      };
      
      await interaction.editReply({ embeds: [embed] });
      return;
    }
    
    if (error instanceof ValidationError) {
      const embed = createErrorEmbed(error, 'Invalid Input');
      await interaction.editReply({ embeds: [embed] });
      return;
    }
    
    const embed = createErrorEmbed(error, 'Command Failed');
    await interaction.editReply({ embeds: [embed] });
  }
}
