import { SlashCommandBooleanOption } from 'discord.js'

export const SPELL_TYPE_OPTION_NAME = `is_it_praxis`

export const isPraxisOptionsBuilder = (option: SlashCommandBooleanOption) =>
    option
        .setName(SPELL_TYPE_OPTION_NAME)
        .setNameLocalizations({ ru: `праксис_ли_это` })
        .setDescription(`Is this spell a Praxis?`)
        .setRequired(true)
