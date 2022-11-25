import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'
import {
    roteOptionsBuilder,
    getRoteDataByName,
    ROTE_OPTION_NAME,
    RoteChoiceValue,
    autocompleteRoteInput,
} from './common/options/roteOptions'
import { getSpellInformation } from './common/getSpellResult'
import { RoteDescription } from '../../wodTypes/common'

const name = `lookup_rote`

const description: LocalizationWithDefault = {
    default: `shows info about Rote with the given name`,
    ru: `ищет информацию по выбранной Рутине`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(
        `Look up a Rote; you can search by Rote name or Arcana name and level`,
    )
    .setDescriptionLocalizations({
        ru: `Найти рутину; можно искать по ее названию или Аркане и уровню`,
    })
    .addStringOption(roteOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({
        ephemeral: true,
    })
    const roteName = interaction.options.getString(
        ROTE_OPTION_NAME,
    ) as RoteChoiceValue
    const roteData: RoteDescription | undefined = getRoteDataByName(roteName)

    if (!roteName || !roteData) {
        return interaction.editReply(`Rote "${roteName}" not found.`)
    }

    await interaction.editReply({
        content: getSpellInformation({
            ...roteData,
            spellType: `rote`,
        }),
    })
}

export const LOOKUP_ROTE_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}

export const LOOKUP_ROTE_AUTOCOMPLETE_COMMAND = {
    name: `lookup_rote`,
    execute: autocompleteRoteInput,
}
