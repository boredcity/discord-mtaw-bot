import { SlashCommandStringOption } from 'discord.js'
import { OrderNameOption } from '../../../wodTypes/common'

export const ORDER_OPTION_NAME = `order`

const choices: { value: OrderNameOption; name: string }[] = [
    { value: `adamantine arrow`, name: `Adamantine Arrow` },
    { value: `guardians of the veil`, name: `Guardians of the Veil` },
    { value: `mysterium`, name: `Mysterium` },
    { value: `silver ladder`, name: `Silver Ladder` },
    { value: `free council`, name: `Free Council` },
    { value: `seers of the throne`, name: `Seers of the Throne` },
    { value: `none`, name: `None` },
]

export const orderOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setName(ORDER_OPTION_NAME)
        .setNameLocalizations({ ru: `орден` })
        .setDescription(`Chose the mage's order`)
        .addChoices(...choices)
        .setRequired(true)
