import { ChatInputCommandInteraction, Locale } from 'discord.js'
import { getRollResults } from './getRollResults'
import { defaultRuleChoice, ruleChoices, RuleChoiceValue } from './ruleOptions'

export const handleDiceRoll = async (
    interaction: ChatInputCommandInteraction,
    count: number | null,
    rule: RuleChoiceValue | null,
) => {
    if (!count) {
        return await interaction.reply({
            content:
                interaction.locale === Locale.Russian
                    ? 'Ooops, something went wrong, sorry :('
                    : 'Упс, что-то пошло не так, извините :(',
            ephemeral: true,
        })
    }

    await interaction.deferReply()
    rule ??= 'rule10Again'

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
        const ruLocale = ruleChoice?.name_localizations?.ru
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

    await interaction.editReply({
        content: `${detailsText}\n${resultText}`,
    })
}
