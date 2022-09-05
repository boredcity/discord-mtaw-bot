export const getMaxYantrasByGnosis = (gnosisDots: number) =>
    Math.ceil(gnosisDots / 2) + 1

export type TimeDuration = {
    value: number
    unit: 'hour(s)' | 'minute(s)'
}
export const getRitualDurationByGnosis = (gnosisDots: number): TimeDuration => {
    switch (gnosisDots) {
        case 1:
        case 2:
            return {
                value: 3,
                unit: 'hour(s)',
            }
        case 3:
        case 4:
            return {
                value: 1,
                unit: 'hour(s)',
            }
        case 5:
        case 6:
            return {
                value: 30,
                unit: 'minute(s)',
            }
        case 7:
        case 8:
            return {
                value: 10,
                unit: 'minute(s)',
            }
        case 9:
        case 10:
        default:
            return {
                value: 1,
                unit: 'minute(s)',
            }
    }
}

export const getManaSpendPerTurnLimit = (gnosis: number) => {
    if (gnosis <= 8) return gnosis
    if (gnosis === 9) return 10
    return 15
}
