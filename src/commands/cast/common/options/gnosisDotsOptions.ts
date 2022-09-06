import { getIntegerOptionsBuilder } from '../../../common/getNumberOptionsBuilder'

export const GNOSIS_DOTS_OPTION_NAME = `gnosis_dots`
export const gnosisDotsBuilder = getIntegerOptionsBuilder({
    name: { default: GNOSIS_DOTS_OPTION_NAME, ru: `точки_мага_в_гнозисе` },
    description: { default: `How many dots mage has in Gnosis?` },
    minValue: 1,
    maxValue: 10,
    isRequired: true,
})
