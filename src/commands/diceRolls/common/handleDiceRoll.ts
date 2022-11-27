import { ChatInputCommandInteraction, Locale } from 'discord.js'
import { RuleChoiceValue } from '../../../wodTypes/ruleChoiceValue'
import { getRollResults } from './getRollResults'
import { defaultRuleChoice, ruleChoices } from './ruleOptions'
import { reportDiceRoll } from './reportDiceRoll'

export const handleDiceRoll = async (
    interaction: ChatInputCommandInteraction,
    count: number | null,
    rule: RuleChoiceValue | null,
    target: number,
) => {
    rule ??= `rule10Again`

    if (!count) {
        return await interaction.reply({
            content:
                interaction.locale === Locale.Russian
                    ? `Ooops, something went wrong, sorry :(`
                    : `Упс, что-то пошло не так, извините :(`,
            ephemeral: true,
        })
    }

    if (!interaction.deferred) {
        await interaction.deferReply()
    }

    const { successes, rolled } = getRollResults({ count, rule, target })

    const isChanceRoll = rule === `ruleNoAgain` && target === 10 && count === 1
    let content
    if (isChanceRoll) {
        content =
            interaction.locale === Locale.Russian
                ? `10! Тебе повезло! 🍀`
                : `10! You got lucky! 🍀`

        if (successes === 0) {
            const value = rolled[0].value
            content =
                interaction.locale === Locale.Russian
                    ? `${value}...Увы, не повезло 🫣`
                    : `${value}...Sorry, no dice! 🫣`
        }
    } else {
        const rolledString = rolled
            .map(
                (roll) =>
                    `${roll.exploaded ? `💥` : ``}${roll.rerolled ? `♻️` : ``}${
                        roll.value
                    }`,
            )
            .join(`, `)

        let ruleNamePostfix = ``
        if (rule !== defaultRuleChoice) {
            const ruleChoice = ruleChoices.find((c) => c.value === rule)
            const ruLocale = ruleChoice?.name_localizations?.ru
            ruleNamePostfix = ` (${ruleChoice?.name})`
            if (interaction.locale === Locale.Russian && ruLocale) {
                ruleNamePostfix = ` (${ruLocale})`
            }
        }

        let resultEmoji = `😨`
        if (successes >= 5) {
            resultEmoji = `🔥`
        } else if (successes >= 1) {
            resultEmoji = `✅`
        }

        const resultText = `${
            interaction.locale === Locale.Russian ? `Успехи` : `Successes`
        }: *${successes}* ${resultEmoji}`

        const detailsText = `\`${rolledString}\` ${ruleNamePostfix}`

        content = `${detailsText}\n${resultText}`
    }

    await Promise.all([
        interaction.editReply({
            content,
        }),
        reportDiceRoll({
            interaction,
            count,
            rule,
            target,
            isChanceRoll: false,
        }),
    ])
}
