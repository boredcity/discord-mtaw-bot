import { SlashCommandIntegerOption } from 'discord.js'
import { LocalizationWithDefault } from '..'

export const getIntegerOptionsBuilder =
    ({
        name,
        description,
        minValue,
        maxValue,
        isRequired = false,
    }: {
        name: LocalizationWithDefault
        description: LocalizationWithDefault
        minValue?: number
        maxValue?: number
        isRequired?: boolean
    }) =>
    (option: SlashCommandIntegerOption) => {
        const { default: nameValue, ...nameLocalizations } = name
        const { default: descriptionValue, ...descriptionLocalizations } =
            description
        let result = option
            .setName(nameValue)
            .setNameLocalizations(nameLocalizations)
            .setDescription(descriptionValue)
            .setDescriptionLocalizations(descriptionLocalizations)

        if (minValue !== undefined) {
            result = result.setMinValue(minValue)
        }
        if (maxValue !== undefined) {
            result = result.setMaxValue(maxValue)
        }
        if (isRequired) {
            result = result.setRequired(true)
        }
        return result
    }
