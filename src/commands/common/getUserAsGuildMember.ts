import { GuildMember, Interaction } from 'discord.js'

export const getUserAsGuildMember = async (
    interaction: Interaction,
): Promise<GuildMember | undefined> => {
    const { username } = interaction.user
    const members = await interaction.guild?.members.fetch({
        query: username,
        limit: 1,
    })

    return members?.find((m) => m.user.username === username)
}
