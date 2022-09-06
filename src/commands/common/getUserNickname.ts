import { Interaction } from 'discord.js'

export const getUserNickname = async (
    interaction: Interaction,
): Promise<string> => {
    const { username } = interaction.user
    const members = await interaction.guild?.members.fetch({
        query: username,
        limit: 1,
    })

    const member = members?.find((m) => m.user.username === username)

    return member?.nickname ?? username
}
