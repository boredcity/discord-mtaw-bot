import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '..'
import { RuleChoiceValue } from '../../wodTypes/ruleChoiceValue'
import {
    diceCountOptionsBuilder,
    DICE_COUNT_OPTION_NAME,
} from './common/diceCountOptions'
import { handleDiceRoll } from './common/handleDiceRoll'
import {
    defaultRuleChoice,
    ruleOptionsBuilder,
    RULE_OPTION_NAME,
} from './common/ruleOptions'

const name = `roll`

const description: LocalizationWithDefault = {
    default: `rolls d10s; you can choose reroll/explosion rule`,
    ru: `кидает кубы d10; можно выбрать, какие взрываются/перебрасываются`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription(`Customize dice roll`)
    .setDescriptionLocalizations({
        [Locale.Russian]: `Настроить бросок кубов`,
    })
    .addIntegerOption(diceCountOptionsBuilder)
    .addStringOption(ruleOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getInteger(DICE_COUNT_OPTION_NAME)

    const rule: RuleChoiceValue =
        (interaction.options.getString(
            RULE_OPTION_NAME,
        ) as null | RuleChoiceValue) ?? defaultRuleChoice

    await handleDiceRoll(interaction, count, rule, 8)
}
export const ROLL_COMMAND: BotChatCommand = {
    name,
    description,
    execute,
    builder,
}
