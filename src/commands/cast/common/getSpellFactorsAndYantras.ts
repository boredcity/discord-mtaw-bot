import { ChatInputCommandInteraction } from 'discord.js'
import { getCastingTimeValue } from './options/castingTimeOptions'
import { getDurationChoices, getDurationValue } from './options/durationOptions'
import { getSpellFactorsText, SpellInfo } from './getSpellResult'
import { getPotencyChoices, getPotencyValue } from './options/potencyOptions'
import { getRangeValue } from './options/rangeOptions'
import { getScaleValue } from './options/scaleOptions'
import { getYantraValues } from './options/yantraOptions'
import { getEffect, SelectedValue } from '../../common/getSelectedValues'
import { PrimaryFactorChoiceValue } from '../../../wodTypes/common'

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
    changeSpellInfoByEffect(spellInfo, potency.effect)
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
    changeSpellInfoByEffect(spellInfo, duration.effect)
    spellInfo.duration = duration

    // range
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const range = await getRangeValue({ interaction, currentSpellInfoText })
    const additionalSympathyYantrasRequired =
        range.value === `sympathetic` ? 1 : 0
    changeSpellInfoByEffect(spellInfo, range.effect)
    spellInfo.range = range

    // scale
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const scale = await getScaleValue({ interaction, currentSpellInfoText })
    changeSpellInfoByEffect(spellInfo, scale.effect)
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
    const overallYantrasEffect = chosenYantras.reduce((acc, y) => {
        acc.dice += y.effect.dice
        acc.reach += y.effect.reach
        acc.mana += y.effect.mana
        return acc
    }, getEffect())
    overallYantrasEffect.dice = Math.min(5, overallYantrasEffect.dice)
    changeSpellInfoByEffect(spellInfo, overallYantrasEffect)

    // casting time
    currentSpellInfoText = getCurrentSpellInfoText(spellInfo, freeReach)
    const castingTime = await getCastingTimeValue({
        interaction,
        currentSpellInfoText,
        gnosisDots,
        yantraValues: chosenYantras.map((y) => y.value),
        additionalSympathyYantrasRequired,
    })
    changeSpellInfoByEffect(spellInfo, castingTime.effect)
    spellInfo.castingTime = castingTime
    return { chosenYantras, spellInfo }
}

export const getCurrentSpellInfoText = (
    spellInfo: SpellInfo,
    freeReach: number,
) => `
Current spell cost:
    Dice to roll: **${spellInfo.diceToRoll}**
    Reach uses: **${spellInfo.reachUsed}** (${freeReach} for free)
    Mana cost: **${spellInfo.manaCost}**

Current spell factors:${getSpellFactorsText(spellInfo)}
`

const changeSpellInfoByEffect = (
    spellInfo: SpellInfo,
    effect: SelectedValue[`effect`],
) => {
    spellInfo.manaCost += effect.mana
    spellInfo.reachUsed += effect.reach
    spellInfo.diceToRoll += effect.dice
}
