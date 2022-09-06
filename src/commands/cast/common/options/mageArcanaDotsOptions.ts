import { getIntegerOptionsBuilder } from '../../../common/getNumberOptionsBuilder'

export const MAGE_ARCANA_DOTS_OPTION_NAME = `mage_arcana_dots`
export const mageArcanaDotsBuilder = getIntegerOptionsBuilder({
    name: {
        default: MAGE_ARCANA_DOTS_OPTION_NAME,
        ru: `точки_мага_в_аркане_заклинания`,
    },
    description: { default: `How many dots mage has in this Arcana?` },
    minValue: 0,
    maxValue: 5,
    isRequired: true,
})
