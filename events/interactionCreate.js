import { Events } from 'discord.js';
import { logger } from '../utils/logger.js';
import { createErrorEmbed } from '../utils/errorHandler.js';

export const name = Events.InteractionCreate;

export async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);
  
  if (!command) {
    logger.warn(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    logger.info(`Executing command ${interaction.commandName} for user ${interaction.user.id}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);
    
    const embed = createErrorEmbed(error, 'Command Execution Failed');
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}
