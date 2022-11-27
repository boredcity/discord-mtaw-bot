import { SlashCommandStringOption } from 'discord.js'
import { PathName } from '../../../wodTypes/common'

export const PATH_OPTION_NAME = `path`

const choices: { value: PathName; name: string }[] = [
    { value: `acanthus`, name: `Acanthus` },
    { value: `mastigos`, name: `Mastigos` },
    { value: `moros`, name: `Moros` },
    { value: `obrimos`, name: `Obrimos` },
    { value: `thyrsus`, name: `Thyrsus` },
]

export const pathOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(PATH_OPTION_NAME)
        .setNameLocalizations({ ru: `путь` })
        .setDescription(`Chose the mage's path`)
        .addChoices(...choices)
        .setRequired(true)
