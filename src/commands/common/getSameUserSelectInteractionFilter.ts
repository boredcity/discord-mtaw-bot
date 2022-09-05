import { Interaction, SelectMenuInteraction } from 'discord.js'

export const getSameUserSelectInteractionFilter =
    (interaction: Interaction) => (i: SelectMenuInteraction) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
    }
