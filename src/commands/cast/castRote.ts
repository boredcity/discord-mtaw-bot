import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'
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
import { getCastingTimeValueAndInfo } from './castingTimeOptions'
import { getScaleCost, getScaleValue } from './scaleOptions'
import { getRangeCost, getRangeValue } from './rangeOptions'
import {
    roteOptionsBuilder,
    RoteDescription,
    getRoteDataByName,
    ROTE_OPTION_NAME,
    RoteChoiceValue,
} from './roteOptions'
import { RoteSpellInfo, getSpellResultContent } from './getSpellResult'
import { getSpellFactorsAndYantras } from './getSpellFactorsAndYantras'

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

    const spellInfo: RoteSpellInfo = {
        ...roteData,
        spellType: 'rote',
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachUsed: 0,
    }
    const freeReach = 5 - roteData.level + 1

    const { chosenYantras, castingTime, potency, duration, range, scale } =
        await getSpellFactorsAndYantras({
            interaction,
            mageArcanaDots,
            primaryFactor: spellInfo.primaryFactor,
            spellInfo,
            gnosisDots,
        })

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

export const CAST_ROTE_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}