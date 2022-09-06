import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotChatCommand, LocalizationWithDefault } from '..'
import { getRollResults } from './common/getRollResults'

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
    await interaction.deferReply()
    const { successes, rolled } = getRollResults({
        count: 1,
        target: 10,
        rule: `ruleNoAgain`,
    })

    let content =
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

    await interaction.editReply({
        content,
    })
}

export const CHANCE_COMMAND: BotChatCommand = {
    name,
    description,
    execute,
    builder,
}
