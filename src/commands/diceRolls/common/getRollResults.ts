import { RuleChoiceValue } from './ruleOptions'

interface DieRollResultInfo {
    value: number
    exploaded: boolean
    rerolled: boolean
}

export function getRollResults({
    count,
    target = 8,
    rule,
}: {
    count: number
    target?: number
    rule: RuleChoiceValue
}): {
    successes: number
    rolled: DieRollResultInfo[]
} {
    const rolled: DieRollResultInfo[] = []
    let successes = 0
    let rollsLeft = count
    while (rollsLeft > 0 || successes >= 20) {
        const dieRollResult = Math.ceil(Math.random() * 10)
        const isSuccess = dieRollResult >= target
        if (isSuccess) successes++
        let shouldExplode = false
        switch (rule) {
            case `ruleNoAgain`:
                break
            case `rule8Again`:
                if (dieRollResult >= 8) shouldExplode = true
                break
            case `rule9Again`:
                if (dieRollResult >= 9) shouldExplode = true
                break
            default:
                if (dieRollResult === 10) shouldExplode = true
                break
        }

        if (!shouldExplode) {
            rollsLeft--
        }

        rolled.push({
            value: dieRollResult,
            exploaded: shouldExplode,
            rerolled: rule === `ruleRoteQuality` && !isSuccess,
        })
    }

    if (rule === `ruleRoteQuality` && successes < 25) {
        const secondRollResults = getRollResults({
            rule: `rule10Again`,
            count: rolled.length - successes,
        })
        successes += secondRollResults.successes
        rolled.push(...secondRollResults.rolled)
    }

    return {
        successes,
        rolled,
    }
}
