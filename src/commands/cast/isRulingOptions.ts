import { SlashCommandBooleanOption } from 'discord.js'

export const IS_RULING_OPTION_NAME = 'is_ruling'

export const isRulingOptionsBuilder = (option: SlashCommandBooleanOption) =>
    option
        .setName(IS_RULING_OPTION_NAME)
        .setDescription("Is this mage's ruling arcana?")
        .setRequired(true)
