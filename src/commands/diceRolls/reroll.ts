import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '..'

import { handleDiceRoll } from './common/handleDiceRoll'
import { getCurrentMageCharacter } from '../../storage/local/utils'

const name = `reroll`

const description: LocalizationWithDefault = {
    default: `rerolls last roll`,
    ru: `повторяет предыдущий бросок`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription(`Roll dice`)
    .setDescriptionLocalizations({
        [Locale.Russian]: `Кинуть кубы`,
    })

const execute = async (interaction: ChatInputCommandInteraction) => {
    const [currentMage] = await Promise.all([
        getCurrentMageCharacter(interaction),
        interaction.deferReply(),
    ])
    const lastRoll = currentMage?.rolls.at(-1)
    if (!currentMage || !lastRoll) {
        await interaction.deleteReply()
        await interaction.followUp({
            content: `Failed to find previous roll for ${
                currentMage?.name ?? `unknown mage`
            }`,
            ephemeral: true,
        })
        return
    }

    await handleDiceRoll(
        interaction,
        lastRoll.diceCount,
        lastRoll.rule,
        lastRoll.target,
    )
}
export const REROLL_COMMAND: BotChatCommand = {
    name,
    description,
    execute,
    builder,
}
