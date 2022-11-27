import { playerStore } from '../../storage/local/playerRepo'
import {
    ChatInputCommandInteraction,
    Locale,
    Role,
    SlashCommandBuilder,
} from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '..'
import { getUserNickname } from '../common/getUserNickname'
import { getUserAsGuildMember } from '../common/getUserAsGuildMember'

const name = `register_player`
const description: LocalizationWithDefault = {
    default: `register as player`,
    ru: `зарегистрироваться как игроку`,
}

const NAME_OPTION_NAME = `name`

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Creates a new mage character`)
    .setDMPermission(false)
    .setDescriptionLocalizations({
        [Locale.Russian]: `Создать персонажа-мага`,
    })
    .addStringOption((option) =>
        option
            .setName(NAME_OPTION_NAME)
            .setDescription(`Player's name`)
            .setNameLocalizations({
                [Locale.Russian]: `теневое_имя`,
            }),
    )

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
        ephemeral: true,
    })

    const userName = interaction.options.getString(NAME_OPTION_NAME)

    let player
    try {
        const [memberName, guildRoles, userAsGuildMember] = await Promise.all([
            getUserNickname(interaction),
            interaction.guild?.roles.fetch(),
            getUserAsGuildMember(interaction),
        ])
        let registredPlayerRole: Role | undefined
        let unregistredPlayerRole: Role | undefined
        for (const roleTuple of guildRoles ?? []) {
            const role = roleTuple[1]
            if (role.name == `Registered Player`) {
                registredPlayerRole = role
            } else if (role.name == `Unregistered Player`) {
                unregistredPlayerRole = role
            }
        }

        if (
            !registredPlayerRole ||
            !unregistredPlayerRole ||
            !userAsGuildMember
        ) {
            throw new Error(`Failed to query data from server`)
        }

        player = await playerStore.create({
            id: interaction.user.id,
            name: userName ?? memberName,
        })
    } catch (err) {
        await interaction.editReply({
            content: `Failed to register as a player.\n${err}`,
        })
        return
    }

    await interaction.editReply({
        content: `You successfully registred as a player ${player.name}!`,
    })
}

export const REGISTER_PLAYER: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
