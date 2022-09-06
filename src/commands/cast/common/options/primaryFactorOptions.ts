import { SlashCommandStringOption } from 'discord.js'
import { ArrayOfOptions } from '../../..'

export const PRIMARY_FACTOR_OPTION_NAME = `primary_factor`
export type PrimaryFactorChoiceValue = `duration` | `potency`

export const primaryFactorChoices: ArrayOfOptions<PrimaryFactorChoiceValue> = [
    {
        name: `Potency`,
        value: `potency`,
    },
    {
        name: `Duration`,
        value: `duration`,
    },
] as const

export const primaryFactorOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setRequired(true)
        .setNameLocalizations({ ru: `первичный_фактор` })
        .setName(PRIMARY_FACTOR_OPTION_NAME)
        .setDescription(`What's the spell's primary factor?`)
        .addChoices(...primaryFactorChoices)
