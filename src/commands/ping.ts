import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '.'

const name = `ping`
const description: LocalizationWithDefault = {
    default: `ping server`,
    ru: `проверяет ответ сервера`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Replies with Pong!`)

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        ephemeral: true,
        content: `Pong! ${Date.now() - interaction.createdTimestamp} ms.`,
    })
}

export const PING_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
