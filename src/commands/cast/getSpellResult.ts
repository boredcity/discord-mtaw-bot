import { capitalize } from '../common/capitalize'
import { SelectedValue, getEffect } from '../common/getSelectedValues'
import {
    CastingTimeChoiceValue,
    isAdvancedCastingTimeValue,
} from './castingTimeOptions'
import { DurationChoiceValue } from './durationOptions'
import { getManaSpendPerTurnLimit } from './gnosis'
import { PotencyChoiceValue } from './potencyOptions'
import { RangeChoiceValue } from './rangeOptions'
import { ScaleChoiceValue } from './scaleOptions'
import { YantraChoiceValue } from './yantraOptions'
import { RoteDescription } from './roteOptions'

type SpellType = `rote` | `praxis` | `improvised_spell`

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

type BaseSpellInfo = SpellFactorsInfo & {
    diceToRoll: number
    reachUsed: number
    manaCost: number
    spellType: SpellType
}

export type RoteSpellInfo = BaseSpellInfo &
    RoteDescription & {
        spellType: `rote`
    }

export type ImprovisedOrPraxisSpellInfo = BaseSpellInfo & {
    practiceDots: number
    spellType: `praxis` | `improvised_spell`
}

export type SpellInfo = RoteSpellInfo | ImprovisedOrPraxisSpellInfo

type SpellResultParam = {
    spellInfo: SpellInfo
    freeReach: number
    chosenYantras: (SelectedValue<YantraChoiceValue> & {
        description?: string
    })[]
    gnosisDots: number
}

export const getSpellResultContent = ({
    freeReach,
    spellInfo,
    chosenYantras,
    gnosisDots,
}: SpellResultParam): string => {
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
        diceToRollDisclaimer = `🚧 you need at least ${requiredForChanceRoll} more ${
            requiredForChanceRoll === 1 ? `die` : `dice`
        }!`
    } else if (diceToRoll < 1) {
        diceToRollDisclaimer = `🎲 chance die!`
    } else {
        diceToRollDisclaimer = `🧙 exceptional success on ${
            spellInfo.spellType === `praxis` ? 3 : 5
        } roll successes.!`
    }

    return `
${getSpellInformation(spellInfo)}
Dice pool: **${diceToRoll}**  ${diceToRollDisclaimer}
    - *remember, you can spending 1 Willpower (+3 dice)*
    - *add all extra dice from Merits, Fate Spells, Artifacts, etc.*

Reaches: **${reachUsed}** (**${freeReach}** free)
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
    - How many times have mage Reached (+1 Paradox die per Reach above ${freeReach})?
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

const getSpellInformation = (spellInfo: SpellInfo) => {
    const { spellType } = spellInfo
    const prefix = `You are casting a${
        spellType === `praxis` ? `n` : ``
    } ${capitalize(spellType)}`

    if (spellType === `rote`) {
        const {
            name,
            arcana,
            level,
            description,
            secondaryRequiredArcana,
            withstand,
        } = spellInfo

        const primaryArcanaAndDots = `${capitalize(arcana)} ${`●`.repeat(
            level,
        )}`

        const secondaryArcanaAndDots = secondaryRequiredArcana
            ? `+${capitalize(secondaryRequiredArcana)}`
            : ``

        const firstLine = `${prefix} "${name}" (${primaryArcanaAndDots}${secondaryArcanaAndDots})`
        const secondLine = `*${description}*`
        const thirdLine = withstand
            ? `Withstand: ${capitalize(withstand)}\n`
            : ``
        return `${firstLine}\n${secondLine}\n${thirdLine}`
    } else {
        return `${prefix} (${`●`.repeat(spellInfo.practiceDots)})\n`
    }
}
