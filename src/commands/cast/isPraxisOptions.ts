import { SlashCommandBooleanOption } from 'discord.js'

export const SPELL_TYPE_OPTION_NAME = `is_praxis`

export const isPraxisOptionsBuilder = (option: SlashCommandBooleanOption) =>
    option
        .setName(SPELL_TYPE_OPTION_NAME)
        .setDescription(`Is this spell a Praxis?`)
        .setRequired(true)
