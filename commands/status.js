import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { dbManager } from '../database/manager.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import { logger } from '../utils/logger.js';
import { createErrorEmbed } from '../utils/errorHandler.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Show bot health and your usage statistics');

export async function execute(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    
    const userId = interaction.user.id;
    const startTime = Date.now();
    
    logger.info(`Status command executed by user ${userId}`);
    
    const userUsage = await rateLimiter.getUserUsage(userId);
    const userStats = dbManager.getUserStats(userId);
    
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    const memoryUsage = process.memoryUsage();
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('🤖 Bot Status & Statistics')
      .setDescription('Current bot health and your usage information')
      .addFields(
        {
          name: '🟢 Bot Health',
          value: [
            '**Status**: Online',
            `**Uptime**: ${uptimeHours}h ${uptimeMinutes}m`,
            `**Memory**: ${memoryMB} MB`,
            '**Database**: Connected'
          ].join('\n'),
          inline: true
        },
        {
          name: '📊 Your Usage',
          value: [
            `**Requests Used**: ${userUsage.requestCount}/${rateLimiter.maxRequests}`,
            `**Remaining**: ${userUsage.remaining}`,
            `**Resets In**: ${rateLimiter.formatTimeUntilReset(userUsage.resetTime)}`
          ].join('\n'),
          inline: true
        },
        {
          name: '📈 Your Statistics',
          value: [
            `**Total Requests**: ${userStats?.total_requests || 0}`,
            `**Successful**: ${userStats?.successful_requests || 0}`,
            `**Avg Response**: ${userStats?.avg_execution_time ? Math.round(userStats.avg_execution_time) + 'ms' : 'N/A'}`
          ].join('\n'),
          inline: true
        }
      )
      .setTimestamp()
      .setFooter({
        text: 'Hook Bot v1.0.0',
        iconURL: interaction.client.user.displayAvatarURL()
      });
    
    await interaction.editReply({ embeds: [embed] });
    
    const executionTime = Date.now() - startTime;
    logger.info(`Status command completed for user ${userId} in ${executionTime}ms`);
    
  } catch (error) {
    logger.error(`Status command failed for user ${interaction.user.id}:`, error);
    
    const embed = createErrorEmbed(error, 'Status Check Failed');
    await interaction.editReply({ embeds: [embed] });
  }
}
