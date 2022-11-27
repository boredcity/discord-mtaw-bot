import { capitalize } from '../../common/capitalize'
import { SelectedValue, getEffect } from '../../common/getSelectedValues'
import {
    CastingTimeChoiceValue,
    isAdvancedCastingTimeValue,
} from './options/castingTimeOptions'
import { DurationChoiceValue } from './options/durationOptions'
import {
    getManaSpendPerTurnLimit,
    getParadoxDiceCountPerReachByGnosis,
} from '../../../gnosisHelpers'
import { PotencyChoiceValue } from './options/potencyOptions'
import { RangeChoiceValue } from './options/rangeOptions'
import { ScaleChoiceValue } from './options/scaleOptions'
import { YantraChoiceValue } from './options/yantraOptions'
import {
    NonRoteSpellTypeChoiceValue,
    SpellTypeChoiceValue,
} from './options/spellTypeOptions'
import { pluralize, pluralizeLabel } from '../../common/pluralize'
import { RoteDescription } from '../../../wodTypes/common'
import { getFullArcanaRequirementsString } from './getFullArcanaRequirementsString'

type SpellFactorsInfo = {
    castingTime: SelectedValue<CastingTimeChoiceValue>
    potency: SelectedValue<PotencyChoiceValue>
    duration: SelectedValue<DurationChoiceValue>
    range: SelectedValue<RangeChoiceValue>
    scale: SelectedValue<ScaleChoiceValue>
}

export const defaultSpellFactors: SpellFactorsInfo = {
    castingTime: { value: `1`, label: `Not selected`, effect: getEffect() },
    potency: { value: `1`, label: `Not selected`, effect: getEffect() },
    duration: { value: `1_turn`, label: `Not selected`, effect: getEffect() },
    range: { value: `standard`, label: `Not selected`, effect: getEffect() },
    scale: { value: `1`, label: `Not selected`, effect: getEffect() },
} as const

const isBaseRoteSpellInfo = (
    spellInfo: BaseRoteSpellInfo | BaseImprovisedOrPraxisSpellInfo,
): spellInfo is BaseRoteSpellInfo => spellInfo.spellType === `rote`

const spellTypeLabels: Record<SpellTypeChoiceValue, string> = {
    praxis: `Praxis`,
    improvised_ruling_arcana: `Improvised Spell`,
    improvised_not_ruling_arcana: `Improvised Spell`,
    rote: `Rote`,
}

type BaseCastingInfo = SpellFactorsInfo & {
    diceToRoll: number
    reachUsed: number
    manaCost: number
    spellType: SpellTypeChoiceValue
}

export type BaseRoteSpellInfo = RoteDescription & {
    spellType: `rote`
}

export type BaseImprovisedOrPraxisSpellInfo = {
    practiceDots: number
    spellType: NonRoteSpellTypeChoiceValue
}

export type RoteSpellInfo = BaseCastingInfo & BaseRoteSpellInfo
export type ImprovisedOrPraxisSpellInfo = BaseCastingInfo &
    BaseImprovisedOrPraxisSpellInfo

export type SpellInfo = RoteSpellInfo | ImprovisedOrPraxisSpellInfo

type SpellResultParam = {
    spellInfo: SpellInfo
    freeReach: number
    chosenYantras: (SelectedValue<YantraChoiceValue> & {
        description?: string
    })[]
    gnosisDots: number
}

export const getSpellResultContent = (
    casterName: string,
    { freeReach, spellInfo, chosenYantras, gnosisDots }: SpellResultParam,
): string => {
    const { diceToRoll, reachUsed, manaCost, castingTime } = spellInfo
    const isDedicatedToolUsed = chosenYantras.some(
        (y) => y.value === `dedicated_tool`,
    )

    const manaSpendPerTurnLimit = getManaSpendPerTurnLimit(gnosisDots)
    const manaSpendReminder = isAdvancedCastingTimeValue(castingTime.value)
        ? `(⚠️ spending Mana above ${manaSpendPerTurnLimit} Mana per Turn might increase Casting Time)`
        : ``

    let diceToRollDisclaimer = ``
    if (diceToRoll < -5) {
        const requiredForChanceRoll = Math.abs(diceToRoll) - 5
        diceToRollDisclaimer = `🚧 you need at least ${requiredForChanceRoll} more ${pluralize(
            requiredForChanceRoll,
            `die`,
            `dice`,
        )}!`
    } else if (diceToRoll < 1) {
        diceToRollDisclaimer = `🎲 chance die!`
    } else {
        diceToRollDisclaimer = `🧙 exceptional success on ${
            spellInfo.spellType === `praxis` ? 3 : 5
        } roll successes!`
    }

    const paradoxPerReach = getParadoxDiceCountPerReachByGnosis(gnosisDots)

    return `
${getSpellInformation(spellInfo, casterName)}
Dice pool: **${diceToRoll}**  ${diceToRollDisclaimer}
    - *remember, you can spending 1 Willpower (+3 dice)*
    - *add all extra dice from Merits, Fate Spells, Artifacts, etc.*

Reaches: **${reachUsed}** (**${freeReach}** free) ${
        reachUsed > freeReach ? `👹` : ``
    }
    - *add 1 Reach for each active spell above Gnosis*
    - *add Reach ${
        spellInfo.spellType === `rote`
            ? `per optional Rotes requirements`
            : `for amazing feats`
    }*

Mana cost: **${manaCost}** ${manaSpendReminder}
    - *add Mana to mitigate Paradox*
    - add Mana ${
        spellInfo.spellType === `rote`
            ? `per optional Rotes requirements`
            : `*for calling to Supernal perfection*`
    }

Yantras bonuses:\n${chosenYantras
        .map(
            (y) =>
                `   - ${y.label} ${
                    y.description ? `(*${y.description}*)` : ``
                }`,
        )
        .join(`\n`)}

👹 Don't forget to tell your ST about things that can affect their Paradox roll:
    - How many times have mage Reached (+${pluralizeLabel(
        paradoxPerReach,
        `die`,
        `dice`,
    )} per Reach above ${freeReach})?
    - Are there any Sleeper whitnesses around? (+1 Paradox die, 9-again (👩‍👦), 8-again (👨‍👨‍👦) or rote quality (👩‍👩‍👧‍👧))
    - Have mage rolled for paradox in this scene (+1 Paradox die per roll)
    - Is mage inured to the spell (+2 Paradox dice)

    - Is dedicated tool used? ${
        isDedicatedToolUsed ? `✅ (-2 Paradox dice)` : `❌ (-0 Paradox dice)`
    }
    - How much mana was spent to mitigate it? (-1 Paradox die per Mana)

🧑‍🔬 Spell Factors:${getSpellFactorsText(spellInfo)}
`
}

export const getSpellFactorsText = (si: SpellInfo) => {
    return `
    Potency: ${si.potency.label}
    Duration: ${si.duration.label}
    Range: ${si.range.label}
    Scale: ${si.scale.label}
    Casting Time: ${si.castingTime.label}`
}

export const getSpellInformation = (
    spellInfo: BaseRoteSpellInfo | BaseImprovisedOrPraxisSpellInfo,
    casterName?: string,
) => {
    const { spellType } = spellInfo
    const prefix = `${casterName ?? `The mage`} is casting a${
        [`improvised_not_ruling_arcana`, `improvised_ruling_arcana`].includes(
            spellType,
        )
            ? `n`
            : ``
    } ${capitalize(spellTypeLabels[spellType] ?? `Spell`)}`

    if (isBaseRoteSpellInfo(spellInfo)) {
        const { name, description, withstand } = spellInfo

        const spellNameAndArcanas = `"${name}" (${getFullArcanaRequirementsString(
            spellInfo,
        )})`
        const spellDescription = `*${description}*`
        const spellWithstand = withstand
            ? `Withstand: ${capitalize(withstand)}\n`
            : ``
        return `${prefix} ${spellNameAndArcanas}\n${spellDescription}\n${spellWithstand}`
    } else {
        return `${prefix} (${`●`.repeat(spellInfo.practiceDots)})\n`
    }
}
