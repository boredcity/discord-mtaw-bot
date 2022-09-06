import { getIntegerOptionsBuilder } from '../../common/getNumberOptionsBuilder'

export const DICE_COUNT_OPTION_NAME = `how_many`
export const diceCountOptionsBuilder = getIntegerOptionsBuilder({
    name: { default: DICE_COUNT_OPTION_NAME, ru: `сколько_кубов` },
    description: {
        default: `How many dice to throw?`,
        ru: `Сколько кубов бросить?`,
    },
    minValue: 1,
    maxValue: 30,
    isRequired: true,
})
