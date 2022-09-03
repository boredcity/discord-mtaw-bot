import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js'
import type { BotCommand, LocalizationWithDefault } from '..'
import { getRollResults } from '../common/getRollResults'

const name = 'chance'

const description: LocalizationWithDefault = {
    default: 'rolls a single d10 chance die according to CoD setting rules',
    ru: 'кидает один куб d10 (бросок на удачу) с учетом правил Хроник Тьмы',
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDMPermission(false)
    .setDescription('Roll chance die')
    .setDescriptionLocalizations({
        [Locale.Russian]: 'Кинуть куб на удачу',
    })

const execute = async (interaction: ChatInputCommandInteraction) => {
    const { successes, rolled } = getRollResults({
        count: 1,
        target: 10,
        rule: 'ruleNoAgain',
    })

    let content =
        interaction.locale === Locale.Russian
            ? '10! Тебе повезло! 🍀'
            : '10! You got lucky! 🍀'

    if (successes === 0) {
        const value = rolled[0].value
        content =
            interaction.locale === Locale.Russian
                ? `${value}...Увы, не повезло 🫣`
                : `${value}... Sorry, no dice! 🫣`
    }

    await interaction.reply({
        content,
        ephemeral: false,
    })
}

export const CHANCE_COMMAND: BotCommand = {
    name,
    description,
    execute,
    builder,
}
