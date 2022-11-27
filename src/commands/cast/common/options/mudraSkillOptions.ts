import { SlashCommandStringOption } from 'discord.js'
import { SkillName } from '../../../../wodTypes/skillName'

export const SKILL_OPTION_NAME = `skill`

const choices: { value: SkillName; name: `${Capitalize<SkillName>}` }[] = [
    { name: `Athletics`, value: `athletics` },
    { name: `Brawl`, value: `brawl` },
    { name: `Drive`, value: `drive` },
    { name: `Firearms`, value: `firearms` },
    { name: `Larceny`, value: `larceny` },
    { name: `Stealth`, value: `stealth` },
    { name: `Survival`, value: `survival` },
    { name: `Weaponry`, value: `weaponry` },
    { name: `Academics`, value: `academics` },
    { name: `Computer`, value: `computer` },
    { name: `Crafts`, value: `crafts` },
    { name: `Investigation`, value: `investigation` },
    { name: `Medicine`, value: `medicine` },
    { name: `Occult`, value: `occult` },
    { name: `Politics`, value: `politics` },
    { name: `Science`, value: `science` },
    { name: `Animal ken`, value: `animal ken` },
    { name: `Empathy`, value: `empathy` },
    { name: `Expression`, value: `expression` },
    { name: `Intimidation`, value: `intimidation` },
    { name: `Persuasion`, value: `persuasion` },
    { name: `Socialize`, value: `socialize` },
    { name: `Streetwise`, value: `streetwise` },
    { name: `Subterfuge`, value: `subterfuge` },
]

export const skillOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(SKILL_OPTION_NAME)
        .setNameLocalizations({ ru: `навык` })
        .setDescription(`What skill?`)
        .addChoices(...choices)
        .setRequired(true)
