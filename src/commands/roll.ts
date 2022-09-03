import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotCommand, LocalizationWithDefault } from '.'
import { getRollResults } from './common/getRollResults'
import {
    defaultRuleChoice,
    ruleChoices,
    RuleChoiceValue,
    RULE_OPTION_NAME,
} from './common/ruleOptions'

const name = 'roll'

const description: LocalizationWithDefault = {
    default: 'rolls d10s according to CoD setting rules',
    ru: 'кидает кубы d10 с учетом правил Хроник Тьмы',
}

const COUNT_OPTION_NAME = 'count'

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription('Roll dice')
    .setDescriptionLocalizations({
        [Locale.Russian]: 'Кинуть кубы',
    })
    .addNumberOption((option) =>
        option
            .setName(COUNT_OPTION_NAME)
            .setDescription('How many dice to throw?')
            .setMinValue(1)
            .setMaxValue(30)
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setRequired(true)
            .setName(RULE_OPTION_NAME)
            .setDescription('What dice should explode or be rerolled?')
            .setDescriptionLocalizations({
                [Locale.Russian]: 'Какие кубы взрывать или перебрасывать?',
            })
            .addChoices(...ruleChoices),
    )

const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getNumber(COUNT_OPTION_NAME)

    const rule: RuleChoiceValue =
        (interaction.options.getString(
            RULE_OPTION_NAME,
        ) as null | RuleChoiceValue) ?? defaultRuleChoice

    if (!count) {
        return await interaction.reply({
            content:
                interaction.locale === Locale.Russian
                    ? 'Ooops, something went wrong, sorry :('
                    : 'Упс, что-то пошло не так, извините :(',
            ephemeral: true,
        })
    }

    const { successes, rolled } = getRollResults({ count, rule })

    const rolledString = rolled
        .sort((a, b) => a.value - b.value)
        .map(
            (roll) =>
                `${roll.exploaded ? '💥' : ''}${roll.rerolled ? '♻️' : ''}${
                    roll.value
                }`,
        )
        .join(', ')

    let ruleNamePostfix = ''
    if (rule !== defaultRuleChoice) {
        const ruleChoice = ruleChoices.find((c) => c.value === rule)
        const ruLocale = ruleChoice?.name_localizations.ru
        ruleNamePostfix = ` (${ruleChoice?.name})`
        if (interaction.locale === Locale.Russian && ruLocale) {
            ruleNamePostfix = ` (${ruLocale})`
        }
    }

    let resultEmoji = '😨'
    if (successes >= 5) {
        resultEmoji = '🔥'
    } else if (successes >= 1) {
        resultEmoji = '✅'
    }

    const resultText = `${
        interaction.locale === Locale.Russian ? 'Успехи' : 'Successes'
    }: *${successes}* ${resultEmoji}`

    const detailsText = `\`${rolledString}\` ${ruleNamePostfix}`

    await interaction.reply({
        content: `${detailsText}\n${resultText}`,
        ephemeral: false,
    })
}
export const ROLL_COMMAND: BotCommand = {
    name,
    description,
    execute,
    builder,
}
