import { SlashCommandStringOption } from 'discord.js'

export const SPELL_TYPE_OPTION_NAME = `spell_type`

export type NonRoteSpellTypeChoiceValue =
    | `praxis`
    | `improvised_ruling_arcana`
    | `improvised_not_ruling_arcana`
export type SpellTypeChoiceValue = NonRoteSpellTypeChoiceValue | `rote`

export const spellTypeOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(SPELL_TYPE_OPTION_NAME)
        .setNameLocalizations({ ru: `тип_заклинания` })
        .setDescription(`What is this spell?`)
        .addChoices(
            {
                value: `praxis`,
                name: `Praxis`,
            },
            {
                value: `improvised_ruling_arcana`,
                name: `Improvised Spell using ruling Arcana`,
            },
            {
                value: `improvised_not_ruling_arcana`,
                name: `Improvised Spell NOT using ruling Arcana`,
            },
        )
        .setRequired(true)
