import { Locale, SlashCommandStringOption } from 'discord.js'
import { ArrayOfOptions } from '../..'

export const RULE_OPTION_NAME = 'rule'
export type RuleChoiceValue =
    | 'ruleNoAgain'
    | 'rule9Again'
    | 'rule8Again'
    | 'ruleRoteQuality'
    | 'rule10Again'

export const defaultRuleChoice = 'rule10Again'

export const ruleChoices: ArrayOfOptions<RuleChoiceValue> = [
    {
        name: '10-again (default)',
        value: 'rule10Again',
        name_localizations: {
            [Locale.Russian]: 'Взрывать 10 (по умолчанию)',
        },
    },
    {
        name: '9-again',
        value: 'rule9Again',
        name_localizations: {
            [Locale.Russian]: 'Взрывать 9+',
        },
    },
    {
        name: '8-again',
        value: 'rule8Again',
        name_localizations: {
            [Locale.Russian]: 'Взрывать 8+',
        },
    },
    {
        name: 'No-again',
        value: 'ruleNoAgain',
        name_localizations: {
            [Locale.Russian]: 'Не взрывать 10',
        },
    },
    {
        name: 'Rote quality',
        value: 'ruleRoteQuality',
        name_localizations: {
            [Locale.Russian]: 'Перебросить все кроме успехов',
        },
    },
] as const

export const ruleOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setRequired(true)
        .setNameLocalizations({ ru: 'правило' })
        .setName(RULE_OPTION_NAME)
        .setDescription('What dice should explode or be rerolled?')
        .setDescriptionLocalizations({
            [Locale.Russian]: 'Какие кубы взрывать или перебрасывать?',
        })
        .addChoices(...ruleChoices)
