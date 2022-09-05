import { practiceOptionsBuilder, PARCTICE_OPTION_NAME } from './practiceOptions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'
import {
    isRulingOptionsBuilder,
    IS_RULING_OPTION_NAME,
} from './isRulingOptions'
import { getIntegerOptionsBuilder } from '../common/getNumberOptionsBuilder'
import { PrimaryFactorChoiceValue } from './primaryFactorOptions'
import { getDurationCost, getDurationChoices } from './durationOptions'
import {
    getPotencyCost,
    getPotencyValue,
    getPotencyChoices,
} from './potencyOptions'
import { getYantraValues } from './yantraOptions'
import {
    isPraxisOptionsBuilder,
    SPELL_TYPE_OPTION_NAME,
} from './isPraxisOptions'
import {
    primaryFactorOptionsBuilder,
    PRIMARY_FACTOR_OPTION_NAME,
} from './primaryFactorOptions'
import { getManaSpendPerTurnLimit, getMaxYantrasByGnosis } from './gnosis'
import {
    getCastingTimeValueAndInfo,
    isAdvancedCastingTimeValue,
} from './castingTimeOptions'
import { getDurationValue } from './durationOptions'
import { getScaleCost, getScaleValue } from './scaleOptions'
import { getRangeCost, getRangeValue } from './rangeOptions'

const name = 'cast_improvised'

const description: LocalizationWithDefault = {
    default: 'cast improvised spell or Praxis',
}

const GNOSIS_DOTS_OPTION_NAME = 'gnosis_dots'
const gnosisDotsBuilder = getIntegerOptionsBuilder({
    name: { default: GNOSIS_DOTS_OPTION_NAME },
    description: { default: 'How many dots mage has in Gnosis?' },
    minValue: 1,
    maxValue: 10,
    isRequired: true,
})

const MAGE_ARCANA_DOTS_OPTION_NAME = 'mage_arcana_dots'
const mageArcanaDotsBuilder = getIntegerOptionsBuilder({
    name: { default: MAGE_ARCANA_DOTS_OPTION_NAME },
    description: { default: 'How many dots mage has in this Arcana?' },
    minValue: 0,
    maxValue: 5,
    isRequired: true,
})

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Cast a spell')
    .setDMPermission(false)
    .addIntegerOption(gnosisDotsBuilder)
    .addIntegerOption(mageArcanaDotsBuilder)
    .addBooleanOption(isPraxisOptionsBuilder)
    .addBooleanOption(isRulingOptionsBuilder)
    .addIntegerOption(practiceOptionsBuilder)
    .addStringOption(primaryFactorOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply()
    const isPraxis = interaction.options.getBoolean(SPELL_TYPE_OPTION_NAME)
    const practiceDots = interaction.options.getInteger(PARCTICE_OPTION_NAME)
    const gnosisDots = interaction.options.getInteger(GNOSIS_DOTS_OPTION_NAME)
    const mageArcanaDots = interaction.options.getInteger(
        MAGE_ARCANA_DOTS_OPTION_NAME,
    )
    const isRulingArcana = interaction.options.getBoolean(IS_RULING_OPTION_NAME)
    const primaryFactor = interaction.options.getString(
        PRIMARY_FACTOR_OPTION_NAME,
    ) as PrimaryFactorChoiceValue | null

    if (
        !practiceDots ||
        !gnosisDots ||
        !mageArcanaDots ||
        isRulingArcana === null ||
        primaryFactor === null ||
        isPraxis === null
    ) {
        // TODO: handle
        return interaction.editReply('Ooops, something went wrong, sorry :(')
    }

    if (practiceDots > mageArcanaDots) {
        return interaction.editReply('Not enough dots in the arcana :(')
    }

    const spellInfo = {
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachesUsed: 0,
    }
    const freeReach = mageArcanaDots - practiceDots + 1

    // ruling arcana
    if (!isRulingArcana && !isPraxis) {
        spellInfo.manaCost += 1
    }

    // potency
    const potencyFreeSteps =
        primaryFactor === 'potency' ? mageArcanaDots - 1 : 0
    const potencyChoices = getPotencyChoices(potencyFreeSteps)
    const potency = await getPotencyValue({
        interaction,
        potencyChoices,
    })
    const potencyCost = getPotencyCost(potency.value, potencyFreeSteps)
    spellInfo.diceToRoll -= potencyCost.dice
    spellInfo.reachesUsed += potencyCost.reach

    // duration
    const durationFreeSteps =
        primaryFactor === 'duration' ? mageArcanaDots - 1 : 0
    const durationChoices = getDurationChoices(durationFreeSteps)
    const duration = await getDurationValue({
        interaction,
        durationChoices,
    })
    const durationCost = getDurationCost(duration.value, durationFreeSteps)
    spellInfo.manaCost += durationCost.mana
    spellInfo.diceToRoll -= durationCost.dice
    spellInfo.reachesUsed += durationCost.reach

    const range = await getRangeValue({ interaction })
    const rangeCost = getRangeCost(range.value)
    const additionalSympathyYantrasRequired =
        range.value === 'sympathetic' ? 1 : 0
    spellInfo.manaCost += rangeCost.mana
    spellInfo.reachesUsed += rangeCost.reach

    const scale = await getScaleValue({ interaction })
    const scaleCost = getScaleCost(scale.value)
    spellInfo.diceToRoll -= scaleCost.dice
    spellInfo.reachesUsed += scaleCost.reach

    const chosenYantras = await getYantraValues({
        maxAllowedYantras:
            getMaxYantrasByGnosis(gnosisDots) -
            additionalSympathyYantrasRequired,
        interaction,
    })
    let isDedicatedToolUsed = false
    for (const y of chosenYantras) {
        spellInfo.diceToRoll += y.diceBonus
        if (y.value === 'dedicated_tool') isDedicatedToolUsed = true
    }

    const {
        diceBonus: castingTimeDiceBonus,
        manaCost: castingTimeManaCost,
        reachCost: castingTimeReachCost,
        label: castingTimeLabel,
        value: castingTime,
    } = await getCastingTimeValueAndInfo({
        interaction,
        gnosisDots,
        yantraValues: chosenYantras.map((y) => y.value),
        additionalSympathyYantrasRequired,
    })
    spellInfo.diceToRoll += castingTimeDiceBonus
    spellInfo.reachesUsed += castingTimeReachCost
    spellInfo.manaCost += castingTimeManaCost

    const manaSpendPerTurnLimit = getManaSpendPerTurnLimit(gnosisDots)
    const manaSpendReminder = isAdvancedCastingTimeValue(castingTime)
        ? `(but remember: you can spend only ${manaSpendPerTurnLimit} Mana per Turn!)`
        : ''

    await interaction.editReply({
        components: [],
        content: `
You are casting a ${isPraxis ? 'Praxis' : 'Improvised Spell'} (${'●'.repeat(
            practiceDots,
        )})

Dice pool: **${spellInfo.diceToRoll}**
Reaches used: **${spellInfo.reachesUsed}** (**${freeReach}** free)
Mana cost: **${spellInfo.manaCost}**
Yantras used:\n**${chosenYantras.map((y) => `   - ${y.label}`).join('\n')}**
${
    additionalSympathyYantrasRequired
        ? `Plus ${additionalSympathyYantrasRequired} required sympathetic Yantra(s)\n`
        : ''
}
🧑‍🔧 You may have to adjust the values above:
    **Extra Reach**
        - active spells (+1 for each spell above Gnosis)
        - per amazing feats
    **+Dice**:
        - spending willpower (+3 dice)
        - extra dice from merits, magic, artifacts, etc.
    **-Mana**:
        - mitigating Paradox
        - calling to Supernal perfection in improvised spells

👹 Don't forget to tell your ST about things that can affect their Paradox roll:
        - Are there any Sleeper whitnesses around? (+1 dice and 9/8-again or rote quality)
        - Have mage rolled for paradox in this scene (+1 per roll)
        - Is mage inured to the spell (+2 dice)

        - Is dedicated tool used? ${isDedicatedToolUsed ? '✅' : '❌'} -2 dice
        - How much mana was spent to mitigate it? (-1 dice per Mana)

🧑‍🔬 Spell Factors:
    Casting Time: ${castingTimeLabel} ${manaSpendReminder}
    Potency: ${potency.label}
    Duration: ${duration.label}
    Range: ${range.label}
    Scale: ${scale.label}
`,
    })
}

export const CAST_IMPROVISED_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
