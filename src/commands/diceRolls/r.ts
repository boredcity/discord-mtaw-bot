import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotCommand, LocalizationWithDefault } from '..'
import { countOptionsBuilder, COUNT_OPTION_NAME } from '../common/countOptions'
import { handleDiceRoll } from '../common/handleDiceRoll'
import { defaultRuleChoice } from '../common/ruleOptions'

const name = 'r'

const description: LocalizationWithDefault = {
    default: 'rolls d10s with 10again rule',
    ru: 'кидает кубы d10, 10-ки взрываются',
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription('Roll dice')
    .setDescriptionLocalizations({
        [Locale.Russian]: 'Кинуть кубы',
    })
    .addNumberOption(countOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getNumber(COUNT_OPTION_NAME)

    await handleDiceRoll(interaction, count, defaultRuleChoice)
}
export const R_COMMAND: BotCommand = {
    name,
    description,
    execute,
    builder,
}
