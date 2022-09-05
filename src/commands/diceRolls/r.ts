import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '..'
import {
    diceCountOptionsBuilder,
    DICE_COUNT_OPTION_NAME,
} from './common/diceCountOptions'
import { handleDiceRoll } from './common/handleDiceRoll'
import { defaultRuleChoice } from './common/ruleOptions'

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
    .addIntegerOption(diceCountOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getInteger(DICE_COUNT_OPTION_NAME)

    await handleDiceRoll(interaction, count, defaultRuleChoice)
}
export const R_COMMAND: BotChatCommand = {
    name,
    description,
    execute,
    builder,
}
