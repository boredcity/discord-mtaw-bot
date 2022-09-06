import { practiceOptionsBuilder, PARCTICE_OPTION_NAME } from './practiceOptions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'
import {
    isRulingOptionsBuilder,
    IS_RULING_OPTION_NAME,
} from './isRulingOptions'
import { getIntegerOptionsBuilder } from '../common/getNumberOptionsBuilder'
import {
    getDurationCost,
    getDurationChoices,
    getDurationValue,
} from './durationOptions'
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
    PrimaryFactorChoiceValue,
} from './primaryFactorOptions'
import { getCastingTimeValueAndInfo } from './castingTimeOptions'
import { getScaleCost, getScaleValue } from './scaleOptions'
import { getRangeCost, getRangeValue } from './rangeOptions'
import {
    getSpellResultContent,
    ImprovisedOrPraxisSpellInfo,
} from './getSpellResult'

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

    const spellInfo: ImprovisedOrPraxisSpellInfo = {
        practiceDots,
        spellType: isPraxis ? 'praxis' : 'improvised_spell',
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachUsed: 0,
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
    spellInfo.reachUsed += potencyCost.reach

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
    spellInfo.reachUsed += durationCost.reach

    // range
    const range = await getRangeValue({ interaction })
    const rangeCost = getRangeCost(range.value)
    const additionalSympathyYantrasRequired =
        range.value === 'sympathetic' ? 1 : 0
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
    })
    chosenYantras.forEach((y) => (spellInfo.diceToRoll += y.diceBonus))

    // castingTime
    const castingTime = await getCastingTimeValueAndInfo({
        interaction,
        gnosisDots,
        yantraValues: chosenYantras.map((y) => y.value),
        additionalSympathyYantrasRequired,
    })
    spellInfo.diceToRoll += castingTime.diceBonus
    spellInfo.reachUsed += castingTime.reachCost
    spellInfo.manaCost += castingTime.manaCost

    await interaction.editReply({
        components: [],
        content: getSpellResultContent({
            freeReach,
            spellInfo,
            chosenYantras,
            castingTime,
            potency,
            duration,
            range,
            scale,
            gnosisDots,
        }),
    })
}

export const CAST_IMPROVISED_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
