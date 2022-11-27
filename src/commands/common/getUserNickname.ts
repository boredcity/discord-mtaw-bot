import { Interaction } from 'discord.js'
import { getUserAsGuildMember } from './getUserAsGuildMember'

export const getUserNickname = async (
    interaction: Interaction,
): Promise<string> => {
    const { username } = interaction.user
    const member = await getUserAsGuildMember(interaction)
    return member?.nickname ?? username
}
