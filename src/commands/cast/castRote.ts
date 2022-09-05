import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'

import { getIntegerOptionsBuilder } from '../common/getNumberOptionsBuilder'
import { getDurationCost, getDurationChoices } from './durationOptions'
import {
    getPotencyCost,
    getPotencyValue,
    getPotencyChoices,
} from './potencyOptions'
import { getYantraValues } from './yantraOptions'
import { getManaSpendPerTurnLimit, getMaxYantrasByGnosis } from './gnosis'
import {
    getCastingTimeValueAndInfo,
    isAdvancedCastingTimeValue,
} from './castingTimeOptions'
import { getDurationValue } from './durationOptions'
import { getScaleCost, getScaleValue } from './scaleOptions'
import { getRangeCost, getRangeValue } from './rangeOptions'
import { roteOptionsBuilder } from './roteOptions'
import {
    getRoteDataByName,
    ROTE_OPTION_NAME,
    RoteChoiceValue,
    RoteDescription,
} from './roteOptions'
import { capitalize } from '../common/capitalize'

const name = 'cast_rote'

const description: LocalizationWithDefault = {
    default: 'cast a Rote spell',
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

const MUDRA_SKILL_DOTS_OPTION_NAME = 'mudra_skill_dots'
const mudraSkillDotsBuilder = getIntegerOptionsBuilder({
    name: { default: MUDRA_SKILL_DOTS_OPTION_NAME },
    description: { default: "How skilled are you in the Rote's mudra?" },
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
    .addIntegerOption(mudraSkillDotsBuilder)
    .addStringOption(roteOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply()
    const roteName = interaction.options.getString(
        ROTE_OPTION_NAME,
    ) as RoteChoiceValue
    const mudraSkillDots = interaction.options.getInteger(
        MUDRA_SKILL_DOTS_OPTION_NAME,
    )
    const gnosisDots = interaction.options.getInteger(GNOSIS_DOTS_OPTION_NAME)
    const mageArcanaDots = interaction.options.getInteger(
        MAGE_ARCANA_DOTS_OPTION_NAME,
    )

    const roteData: RoteDescription | undefined = getRoteDataByName(roteName)

    if (!gnosisDots || !mageArcanaDots || mudraSkillDots === null) {
        // TODO: handle
        return interaction.editReply('Ooops, something went wrong, sorry :(')
    }

    if (!roteName || !roteData) {
        return interaction.editReply(`Rote ${roteName} not found :(`)
    }

    if (roteData.level > mageArcanaDots) {
        return interaction.editReply('Not enough dots in the arcana :(')
    }

    const spellInfo = {
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachesUsed: 0,
    }
    const freeReach = 5 - roteData.level + 1

    // potency
    const potencyFreeSteps =
        roteData.primaryFactor === 'potency' ? mageArcanaDots - 1 : 0
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
        roteData.primaryFactor === 'duration' ? mageArcanaDots - 1 : 0
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
        mudraSkillDots,
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
        // FIXME: reuse
        content: `
You are casting a Rote "${roteData.name}" (${capitalize(
            roteData.arcana,
        )} ${'●'.repeat(roteData.level)})
*${roteData.description}*

Dice pool: **${spellInfo.diceToRoll}**
Reaches used: **${spellInfo.reachesUsed}** (**${freeReach}** free)
Mana cost: **${spellInfo.manaCost}**
Yantras used:\n${chosenYantras.map((y) => `   - ${y.label}`).join('\n')}
${
    additionalSympathyYantrasRequired
        ? `Plus ${additionalSympathyYantrasRequired} required sympathetic Yantra(s)\n`
        : ''
}
🧑‍🔧 You may have to adjust the values above:
    **Extra Reach**
        - per Rotes requirements
        - active spells (+1 for each spell above Gnosis)
    **+Dice**:
        - spending willpower (+3 dice)
        - extra dice from merits, magic, artifacts, etc.
    **-Mana**:
        - per Rote's requirements
        - mitigating Paradox

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

export const CAST_ROTE_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
