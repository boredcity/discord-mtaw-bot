import { playerStore } from './../../storage/local/playerRepo'
import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '..'
import { mageStore } from '../../storage/local/mageRepo'
import { orderOptionsBuilder, ORDER_OPTION_NAME } from './options/orderOptions'
import { pathOptionsBuilder, PATH_OPTION_NAME } from './options/pathOptions'
import { viceOptionsBuilder, VICE_OPTION_NAME } from './options/viceOptions'
import {
    virtueOptionsBuilder,
    VIRTUE_OPTION_NAME,
} from './options/virtueOptions'
import { OrderNameOption, PathName } from '../../wodTypes/common'

const name = `create_mage`
const description: LocalizationWithDefault = {
    default: `create new mage character`,
    ru: `создать нового персонажа-мага`,
}

const SHADOW_NAME_OPTION_NAME = `shadow_name`
const FALLEN_NAME_OPTION_NAME = `fallen_name`
const CONCEPT_OPTION_NAME = `character_concept`

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Creates a new mage character`)
    .setDMPermission(false)
    .setDescriptionLocalizations({
        [Locale.Russian]: `Создать персонажа-мага`,
    })
    .addStringOption((option) =>
        option
            .setName(SHADOW_NAME_OPTION_NAME)
            .setDescription(`Mage's shadow name`)
            .setNameLocalizations({
                [Locale.Russian]: `теневое_имя`,
            })
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName(FALLEN_NAME_OPTION_NAME)
            .setDescription(`Mage's birth name`)
            .setNameLocalizations({
                [Locale.Russian]: `истинное_имя`,
            })
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName(CONCEPT_OPTION_NAME)
            .setDescription(`Character's concept`)
            .setNameLocalizations({
                [Locale.Russian]: `концепт_персонажа`,
            })
            .setRequired(true),
    )
    .addStringOption(orderOptionsBuilder)
    .addStringOption(pathOptionsBuilder)
    .addStringOption(viceOptionsBuilder)
    .addStringOption(virtueOptionsBuilder)

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
        ephemeral: true,
    })
    const fallenName = interaction.options.getString(FALLEN_NAME_OPTION_NAME)
    const shadowName = interaction.options.getString(SHADOW_NAME_OPTION_NAME)
    const path = interaction.options.getString(PATH_OPTION_NAME) as PathName
    const order = interaction.options.getString(
        ORDER_OPTION_NAME,
    ) as OrderNameOption
    const vice = interaction.options.getString(VICE_OPTION_NAME)
    const virtue = interaction.options.getString(VIRTUE_OPTION_NAME)
    const concept = interaction.options.getString(CONCEPT_OPTION_NAME)

    if (
        !fallenName ||
        !shadowName ||
        !path ||
        !order ||
        !vice ||
        !virtue ||
        !concept
    ) {
        console.error(
            `Some data not provided`,
            JSON.stringify({
                fallenName,
                shadowName,
                path,
                order,
                vice,
                concept,
                virtue,
            }),
        )
        return interaction.editReply(`Ooops, something went wrong, sorry :(`)
    }

    const player = await playerStore.getById(interaction.user.id)

    if (!player) {
        await interaction.editReply({
            content: `Sorry, you have to register as a Player first!`,
        })
        return
    }

    const createdMage = await mageStore.create({
        name: fallenName,
        shadowName,
        path,
        order,
        virtue,
        vice,
        concept,
    })

    player?.characterIds.push(createdMage.id)

    if (player.activeCharacterId === undefined) {
        player.activeCharacterId = createdMage.id
    }

    await playerStore.update(player)

    await interaction.editReply({
        content: `A new mage character ${createdMage.shadowName} was created by ${player.name}!`,
    })
}

export const CREATE_CHARACTER: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
