import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '..'
import { handleDiceRoll } from './common/handleDiceRoll'

const name = `chance`

const description: LocalizationWithDefault = {
    default: `rolls a single d10 chance die`,
    ru: `кидает один куб d10 (бросок на удачу)`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription(`Roll chance die`)
    .setDescriptionLocalizations({
        [Locale.Russian]: `Кинуть куб на удачу`,
    })

const execute = async (interaction: ChatInputCommandInteraction) => {
    await handleDiceRoll(interaction, 1, `ruleNoAgain`, 10)
}

export const CHANCE_COMMAND: BotChatCommand = {
    name,
    description,
    execute,
    builder,
}
