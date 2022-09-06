import { ChatInputCommandInteraction } from 'discord.js'
import { getCastingTimeValue } from './castingTimeOptions'
import {
    getDurationChoices,
    getDurationCost,
    getDurationValue,
} from './durationOptions'
import { getSpellFactorsText, SpellInfo } from './getSpellResult'
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
    freeReach: number
    mudraSkillDots?: number
}

export const getSpellFactorsAndYantras = async ({
    mageArcanaDots,
    interaction,
    gnosisDots,
    primaryFactor,
    mudraSkillDots,
    spellInfo,
    freeReach,
}: GetSpellFactorsParam) => {
    // potency
    let currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const potencyFreeSteps =
        primaryFactor === `potency` ? mageArcanaDots - 1 : 0
    const potencyChoices = getPotencyChoices(potencyFreeSteps)
    const potency = await getPotencyValue({
        currentSpellInfoText,
        interaction,
        potencyChoices,
    })
    const potencyCost = getPotencyCost(potency.value, potencyFreeSteps)
    spellInfo.diceToRoll -= potencyCost.dice
    spellInfo.reachUsed += potencyCost.reach
    spellInfo.potency = potency

    // duration
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const durationFreeSteps =
        primaryFactor === `duration` ? mageArcanaDots - 1 : 0
    const durationChoices = getDurationChoices(durationFreeSteps)
    const duration = await getDurationValue({
        interaction,
        durationChoices,
        currentSpellInfoText,
    })
    const durationCost = getDurationCost(duration.value, durationFreeSteps)
    spellInfo.manaCost += durationCost.mana
    spellInfo.diceToRoll -= durationCost.dice
    spellInfo.reachUsed += durationCost.reach
    spellInfo.duration = duration

    // range
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const range = await getRangeValue({ interaction, currentSpellInfoText })
    const rangeCost = getRangeCost(range.value)
    const additionalSympathyYantrasRequired =
        range.value === `sympathetic` ? 1 : 0
    spellInfo.manaCost += rangeCost.mana
    spellInfo.reachUsed += rangeCost.reach
    spellInfo.range = range

    // scale
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const scale = await getScaleValue({ interaction, currentSpellInfoText })
    const scaleCost = getScaleCost(scale.value)
    spellInfo.diceToRoll -= scaleCost.dice
    spellInfo.reachUsed += scaleCost.reach
    spellInfo.scale = scale

    // yantras
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const chosenYantras = await getYantraValues({
        gnosisDots,
        currentSpellInfoText,
        additionalSympathyYantrasRequired,
        interaction,
        mudraSkillDots:
            spellInfo.spellType === `rote` ? mudraSkillDots : undefined,
    })
    chosenYantras.forEach((y) => (spellInfo.diceToRoll += y.diceBonus))

    // casting time
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const castingTime = await getCastingTimeValue({
        interaction,
        currentSpellInfoText,
        gnosisDots,
        yantraValues: chosenYantras.map((y) => y.value),
        additionalSympathyYantrasRequired,
    })
    spellInfo.diceToRoll += castingTime.diceBonus
    spellInfo.reachUsed += castingTime.cost.reach
    spellInfo.manaCost += castingTime.cost.mana
    spellInfo.castingTime = castingTime

    return { chosenYantras, spellInfo }
}

export const getCurrentSpellInfoText = (spellInfo: SpellInfo, freeReach: number) => `
Current spell cost:
    Dice to roll: **${spellInfo.diceToRoll}**
    Reach uses: **${spellInfo.reachUsed}** (${freeReach} for free)
    Mana cost: **${spellInfo.manaCost}**

Current spell factors:${getSpellFactorsText(spellInfo)}
`
