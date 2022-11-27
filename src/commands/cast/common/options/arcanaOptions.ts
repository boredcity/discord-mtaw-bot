import { SlashCommandStringOption } from 'discord.js'
import { ArcanaName } from '../../../../wodTypes/arcaneName'

export const ARCANA_OPTION_NAME = `arcana`

const choices: { value: ArcanaName; name: `${Capitalize<ArcanaName>}` }[] = [
    { value: `death`, name: `Death` },
    { value: `life`, name: `Life` },
    { value: `forces`, name: `Forces` },
    { value: `fate`, name: `Fate` },
    { value: `matter`, name: `Matter` },
    { value: `mind`, name: `Mind` },
    { value: `prime`, name: `Prime` },
    { value: `space`, name: `Space` },
    { value: `spirit`, name: `Spirit` },
    { value: `time`, name: `Time` },
]

export const arcanaOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(ARCANA_OPTION_NAME)
        .setNameLocalizations({ ru: `аркана` })
        .setDescription(`What arcana?`)
        .addChoices(...choices)
        .setRequired(true)
