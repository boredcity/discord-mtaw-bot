import { SlashCommandStringOption } from 'discord.js'
import { ViceName } from '../../../wodTypes/viceName'

export const VICE_OPTION_NAME = `vice`

const choices: { value: ViceName; name: string }[] = [
    { value: `ambitious`, name: `Ambitious` },
    { value: `addictive`, name: `Addictive` },
    { value: `corrupt`, name: `Corrupt` },
    { value: `cruel`, name: `Cruel` },
    { value: `deceitful`, name: `Deceitful` },
    { value: `dogmatic`, name: `Dogmatic` },
    { value: `greedy`, name: `Greedy` },
    { value: `hasty`, name: `Hasty` },
    { value: `hateful`, name: `Hateful` },
    { value: `pessimistic`, name: `Pessimistic` },
]

export const viceOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(VICE_OPTION_NAME)
        .setNameLocalizations({ ru: `порок` })
        .setDescription(`Chose the mage's vice`)
        .addChoices(...choices)
        .setRequired(true)
