import { Interaction } from 'discord.js'
import { getCurrentMageCharacter } from '../../../storage/local/utils'
import { RuleChoiceValue } from '../../../wodTypes/ruleChoiceValue'
import { mageStore } from '../../../storage/local/mageRepo'

type DiceReportParams = {
    interaction: Interaction
    count: number
    rule: RuleChoiceValue
    target: number
    isChanceRoll: boolean
}

export const reportDiceRoll = async ({
    interaction,
    count,
    rule,
    target,
    isChanceRoll,
}: DiceReportParams) => {
    const currentMage = await getCurrentMageCharacter(interaction)
    if (!currentMage) return
    currentMage.rolls.push({
        id: new Date().toISOString(),
        isChanceRoll,
        diceCount: count,
        rule,
        target,
    })
    await mageStore.update(currentMage)
}
