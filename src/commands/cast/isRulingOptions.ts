import { SlashCommandBooleanOption } from 'discord.js'

export const IS_RULING_OPTION_NAME = `uses_ruling_arcana`

export const isRulingOptionsBuilder = (option: SlashCommandBooleanOption) =>
    option
        .setName(IS_RULING_OPTION_NAME)
        .setNameLocalizations({ ru: `основной_аркан_пути` })
        .setDescription(`Is this mage's ruling arcana?`)
        .setRequired(true)
