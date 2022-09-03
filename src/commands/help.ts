import { SlashCommandBuilder } from '@discordjs/builders'
import { EmbedBuilder, Locale } from 'discord.js'
import type { BotCommand, LocalizationWithDefault } from './index'
import { ALL_COMMANDS } from './index'

const name = 'help'

const description: LocalizationWithDefault = {
    default: 'shows a list of available commands',
    ru: 'показывает полный список команд',
}

export const HELP_COMMAND: BotCommand = {
    name,
    description,
    builder: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Provides information on using this bot.')
        .setDescriptionLocalizations({
            [Locale.Russian]: 'Информация о том, как использовать этого бота',
        }),
    execute: async (interaction) => {
        await interaction.deferReply()
        const locale = interaction.locale
        const helpEmbed = new EmbedBuilder()
        helpEmbed.setTitle('Chronicles of Darkness Helper Bot')
        helpEmbed.setDescription(
            locale === Locale.Russian
                ? 'Этот бот создан, чтоб помочь с играми в сеттинге "Хроники Тьмы"'
                : 'This discord bot is designed to help you with "Chronicles of Darkness" games',
        )
        helpEmbed.addFields(
            ALL_COMMANDS.map((c) => ({
                name: `\`${c.name}\``,
                value:
                    locale === Locale.Russian
                        ? c.description.ru ?? c.description.default
                        : c.description.default,
            })),
        )
        helpEmbed.setFooter({
            text: `${locale === Locale.Russian ? 'Версия' : 'Version'} ${
                process.env.npm_package_version
            }`,
        })
        await interaction.editReply({ embeds: [helpEmbed] })
        return
    },
}
