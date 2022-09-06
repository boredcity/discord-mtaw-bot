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
    isPraxisOptionsBuilder,
    SPELL_TYPE_OPTION_NAME,
} from './isPraxisOptions'
import {
    primaryFactorOptionsBuilder,
    PRIMARY_FACTOR_OPTION_NAME,
    PrimaryFactorChoiceValue,
} from './primaryFactorOptions'
import {
    defaultSpellFactors,
    getSpellResultContent,
    ImprovisedOrPraxisSpellInfo,
} from './getSpellResult'
import { getSpellFactorsAndYantras } from './getSpellFactorsAndYantras'

const name = `cast_improvised`

const description: LocalizationWithDefault = {
    default: `cast improvised spell or Praxis`,
}

const GNOSIS_DOTS_OPTION_NAME = `gnosis_dots`
const gnosisDotsBuilder = getIntegerOptionsBuilder({
    name: { default: GNOSIS_DOTS_OPTION_NAME },
    description: { default: `How many dots mage has in Gnosis?` },
    minValue: 1,
    maxValue: 10,
    isRequired: true,
})

const MAGE_ARCANA_DOTS_OPTION_NAME = `mage_arcana_dots`
const mageArcanaDotsBuilder = getIntegerOptionsBuilder({
    name: { default: MAGE_ARCANA_DOTS_OPTION_NAME },
    description: { default: `How many dots mage has in this Arcana?` },
    minValue: 0,
    maxValue: 5,
    isRequired: true,
})

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Cast a spell`)
    .setDMPermission(false)
    .addIntegerOption(gnosisDotsBuilder)
    .addIntegerOption(mageArcanaDotsBuilder)
    .addBooleanOption(isPraxisOptionsBuilder)
    .addBooleanOption(isRulingOptionsBuilder)
    .addIntegerOption(practiceOptionsBuilder)
    .addStringOption(primaryFactorOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({
        ephemeral: true,
    })
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
        console.error(
            `Some data not provided`,
            JSON.stringify({
                practiceDots,
                gnosisDots,
                mageArcanaDots,
                isRulingArcana,
                primaryFactor,
                isPraxis,
            }),
        )
        return interaction.editReply(`Ooops, something went wrong, sorry :(`)
    }

    if (practiceDots > mageArcanaDots) {
        return interaction.editReply(`Not enough dots in the arcana :(`)
    }

    const spellInfo: ImprovisedOrPraxisSpellInfo = {
        ...defaultSpellFactors,
        practiceDots,
        spellType: isPraxis ? `praxis` : `improvised_spell`,
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachUsed: 0,
    }
    const freeReach = mageArcanaDots - practiceDots + 1

    // ruling arcana
    if (!isRulingArcana && !isPraxis) {
        spellInfo.manaCost += 1
    }

    const { chosenYantras } = await getSpellFactorsAndYantras({
        interaction,
        mageArcanaDots,
        primaryFactor,
        spellInfo,
        gnosisDots,
        freeReach,
    })

    await interaction.editReply({
        components: [],
        content: `Calculating...`,
    })

    await interaction.followUp({
        ephemeral: false,
        components: [],
        content: getSpellResultContent({
            freeReach,
            spellInfo,
            chosenYantras,
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
