import { SlashCommandNumberOption } from 'discord.js'
export const COUNT_OPTION_NAME = 'count'

const minCount = 1
const maxCount = 30

export const countOptionsBuilder = (option: SlashCommandNumberOption) =>
    option
        .setName(COUNT_OPTION_NAME)
        .setNameLocalizations({ ru: 'сколько' })
        .setDescription('How many dice to throw?')
        .setMinValue(minCount)
        .setMaxValue(maxCount)
        .setRequired(true)
