import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotCommand, LocalizationWithDefault } from '..'
import { countOptionsBuilder, COUNT_OPTION_NAME } from '../common/countOptions'
import { handleDiceRoll } from '../common/handleDiceRoll'
import {
    defaultRuleChoice,
    RuleChoiceValue,
    ruleOptionsBuilder,
    RULE_OPTION_NAME,
} from '../common/ruleOptions'

const name = 'roll'

const description: LocalizationWithDefault = {
    default: 'rolls d10s; you can choose reroll/explosion rule',
    ru: 'кидает кубы d10; можно выбрать, какие взрываются/перебрасываются',
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription('Customize dice roll')
    .setDescriptionLocalizations({
        [Locale.Russian]: 'Настроить бросок кубов',
    })
    .addNumberOption(countOptionsBuilder)
    .addStringOption(ruleOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getNumber(COUNT_OPTION_NAME)

    const rule: RuleChoiceValue =
        (interaction.options.getString(
            RULE_OPTION_NAME,
        ) as null | RuleChoiceValue) ?? defaultRuleChoice

    await handleDiceRoll(interaction, count, rule)
}
export const ROLL_COMMAND: BotCommand = {
    name,
    description,
    execute,
    builder,
}
