import { ChatInputCommandInteraction } from 'discord.js'
import { getCastingTimeValueAndInfo } from './castingTimeOptions'
import {
    getDurationChoices,
    getDurationCost,
    getDurationValue,
} from './durationOptions'
import { SpellInfo } from './getSpellResult'
import {
    getPotencyChoices,
    getPotencyCost,
    getPotencyValue,
} from './potencyOptions'
import { PrimaryFactorChoiceValue } from './primaryFactorOptions'
import { getRangeCost, getRangeValue } from './rangeOptions'
import { getScaleCost, getScaleValue } from './scaleOptions'
import { getYantraValues } from './yantraOptions'

type GetSpellFactorsParam = {
    mageArcanaDots: number
    interaction: ChatInputCommandInteraction
    primaryFactor: PrimaryFactorChoiceValue
    spellInfo: SpellInfo
    gnosisDots: number
    mudraSkillDots?: number
}

export const getSpellFactorsAndYantras = async ({
    mageArcanaDots,
    interaction,
    gnosisDots,
    primaryFactor,
    mudraSkillDots,
    spellInfo,
}: GetSpellFactorsParam) => {
    // potency
    let currentSpellCosts = getCurrentSpellCost(spellInfo)
    const potencyFreeSteps =
        primaryFactor === `potency` ? mageArcanaDots - 1 : 0
    const potencyChoices = getPotencyChoices(potencyFreeSteps)
    const potency = await getPotencyValue({
        currentSpellCosts,
        interaction,
        potencyChoices,
    })
    const potencyCost = getPotencyCost(potency.value, potencyFreeSteps)
    spellInfo.diceToRoll -= potencyCost.dice
    spellInfo.reachUsed += potencyCost.reach

    // duration
    currentSpellCosts = getCurrentSpellCost(spellInfo)
    const durationFreeSteps =
        primaryFactor === `duration` ? mageArcanaDots - 1 : 0
    const durationChoices = getDurationChoices(durationFreeSteps)
    const duration = await getDurationValue({
        interaction,
        durationChoices,
        currentSpellCosts,
    })
    const durationCost = getDurationCost(duration.value, durationFreeSteps)
    spellInfo.manaCost += durationCost.mana
    spellInfo.diceToRoll -= durationCost.dice
    spellInfo.reachUsed += durationCost.reach

    // range
    currentSpellCosts = getCurrentSpellCost(spellInfo)
    const range = await getRangeValue({ interaction, currentSpellCosts })
    const rangeCost = getRangeCost(range.value)
    const additionalSympathyYantrasRequired =
        range.value === `sympathetic` ? 1 : 0
    spellInfo.manaCost += rangeCost.mana
    spellInfo.reachUsed += rangeCost.reach

    // scale
    const scale = await getScaleValue({ interaction })
    const scaleCost = getScaleCost(scale.value)
    spellInfo.diceToRoll -= scaleCost.dice
    spellInfo.reachUsed += scaleCost.reach

    // yantras
    const chosenYantras = await getYantraValues({
        gnosisDots,
        additionalSympathyYantrasRequired,
        interaction,
        mudraSkillDots:
            spellInfo.spellType === `rote` ? mudraSkillDots : undefined,
    })
    chosenYantras.forEach((y) => (spellInfo.diceToRoll += y.diceBonus))

    // casting time
    const castingTime = await getCastingTimeValueAndInfo({
        interaction,
        gnosisDots,
        yantraValues: chosenYantras.map((y) => y.value),
        additionalSympathyYantrasRequired,
    })
    spellInfo.diceToRoll += castingTime.diceBonus
    spellInfo.reachUsed += castingTime.reachCost
    spellInfo.manaCost += castingTime.manaCost

    return { chosenYantras, castingTime, potency, duration, range, scale }
}

export const getCurrentSpellCost = (spellInfo: SpellInfo) => `
Current spell cost:
    Dice to roll: **${spellInfo.diceToRoll}**
    Reach uses: **${spellInfo.reachUsed}**
    Mana cost: **${spellInfo.manaCost}**

`
