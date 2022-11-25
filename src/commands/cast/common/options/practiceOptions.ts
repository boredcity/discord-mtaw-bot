import { SlashCommandIntegerOption } from 'discord.js'
import { ArrayOfOptions } from '../../..'
import { RepeatString } from '../../../../commonTypes'
import { PracticeName } from '../../../../wodTypes/practiceName'

export const PARCTICE_OPTION_NAME = `practice`
export type PracticeChoiceValue = 1 | 2 | 3 | 4 | 5

type PracticeDescription =
    `${RepeatString<`●`>} ${Capitalize<PracticeName>} - ${string}`
export const practiceChoices: ArrayOfOptions<
    PracticeChoiceValue,
    PracticeDescription
> = [
    {
        name: `● Compelling - nudge possible into reality`,
        value: 1,
    },
    {
        name: `● Knowing - deliver knowledge to target`,
        value: 1,
    },
    {
        name: `● Unveiling - expose hidden things to senses`,
        value: 1,
    },
    {
        name: `●● Ruling - shape and direct`,
        value: 2,
    },
    {
        name: `●● Shielding - bolster defence`,
        value: 2,
    },
    {
        name: `●● Veiling - hide or camouflage from or by Arcanum`,
        value: 2,
    },
    {
        name: `●●● Fraying - weaken or injure (Bashing).`,
        value: 3,
    },
    {
        name: `●●● Perfecting - improve or repair`,
        value: 3,
    },
    {
        name: `●●● Weaving - alter or transmute (no changing nature)`,
        value: 3,
    },
    {
        name: `●●●● Patterning - transform completely`,
        value: 4,
    },
    {
        name: `●●●● Unraveling - impair or injure (Lethal)`,
        value: 4,
    },
    {
        name: `●●●●● Making - conjure ex nihilo`,
        value: 5,
    },
    {
        name: `●●●●● Unmaking - annihilate entirely`,
        value: 5,
    },
] as const

export const practiceOptionsBuilder = (option: SlashCommandIntegerOption) =>
    option
        .setRequired(true)
        .setNameLocalizations({ ru: `практика` })
        .setName(PARCTICE_OPTION_NAME)
        .setDescription(`What practice is used?`)
        .addChoices(...practiceChoices)
