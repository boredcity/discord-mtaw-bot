import { numberFrom1to10 } from './commonTypes'
export const getMaxYantrasByGnosis = (gnosisDots: number) =>
    Math.ceil(gnosisDots / 2) + 1

export const getParadoxDiceCountPerReachByGnosis = (gnosisDots: number) =>
    Math.ceil(gnosisDots / 2)

export type TimeDuration = {
    value: number
    unit: `hour(s)` | `minute(s)`
}
export const getRitualDurationByGnosis = (gnosisDots: number): TimeDuration => {
    switch (gnosisDots) {
        case 1:
        case 2:
            return {
                value: 3,
                unit: `hour(s)`,
            }
        case 3:
        case 4:
            return {
                value: 1,
                unit: `hour(s)`,
            }
        case 5:
        case 6:
            return {
                value: 30,
                unit: `minute(s)`,
            }
        case 7:
        case 8:
            return {
                value: 10,
                unit: `minute(s)`,
            }
        case 9:
        case 10:
        default:
            return {
                value: 1,
                unit: `minute(s)`,
            }
    }
}

export const getManaSpendPerTurnLimit = (gnosis: number) => {
    if (gnosis <= 8) return gnosis
    if (gnosis === 9) return 10
    return 15
}

export const getManaLimit = (gnosis: numberFrom1to10): number => {
    return {
        1: 10,
        2: 11,
        3: 12,
        4: 13,
        5: 15,
        6: 20,
        7: 25,
        8: 30,
        9: 50,
        10: 75,
    }[gnosis]
}
