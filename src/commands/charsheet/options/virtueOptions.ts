import { SlashCommandStringOption } from 'discord.js'
import { VirtueName } from '../../../wodTypes/virtueName'

export const VIRTUE_OPTION_NAME = `virtue`

const choices: { value: VirtueName; name: string }[] = [
    { value: `ambitious`, name: `Ambitious` },
    { value: `courageous`, name: `Courageous` },
    { value: `generous`, name: `Generous` },
    { value: `honest`, name: `Honest` },
    { value: `hopeful`, name: `Hopeful` },
    { value: `just`, name: `Just` },
    { value: `loving`, name: `Loving` },
    { value: `loyal`, name: `Loyal` },
    { value: `patient`, name: `Patient` },
    { value: `trustworthy`, name: `Trustworthy` },
]

export const virtueOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(VIRTUE_OPTION_NAME)
        .setNameLocalizations({ ru: `добродетель` })
        .setDescription(`Chose the mage's virtue`)
        .addChoices(...choices)
        .setRequired(true)
