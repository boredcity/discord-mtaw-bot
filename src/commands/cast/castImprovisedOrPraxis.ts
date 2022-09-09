import {
    practiceOptionsBuilder,
    PARCTICE_OPTION_NAME,
} from './common/options/practiceOptions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../index'
import {
    primaryFactorOptionsBuilder,
    PRIMARY_FACTOR_OPTION_NAME,
    PrimaryFactorChoiceValue,
} from './common/options/primaryFactorOptions'
import {
    defaultSpellFactors,
    getSpellResultContent,
    ImprovisedOrPraxisSpellInfo,
} from './common/getSpellResult'
import { getSpellFactorsAndYantras } from './common/getSpellFactorsAndYantras'
import { getUserNickname } from '../common/getUserNickname'
import {
    NonRoteSpellTypeChoiceValue,
    spellTypeOptionsBuilder,
    SPELL_TYPE_OPTION_NAME,
} from './common/options/spellTypeOptions'
import {
    gnosisDotsBuilder,
    GNOSIS_DOTS_OPTION_NAME,
} from './common/options/gnosisDotsOptions'
import {
    mageArcanaDotsBuilder,
    MAGE_ARCANA_DOTS_OPTION_NAME,
} from './common/options/mageArcanaDotsOptions'

const name = `cast_improvised`

const description: LocalizationWithDefault = {
    default: `calculates dice, reach and mana needed to cast an improvised spell or Praxis`,
    ru: `рассчитывает, сколько кубов, Усилий и Маны нужно для создания импровизированного заклинания или Праксиса`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Cast improvised spell or Praxis`)
    .setDMPermission(false)
    .addIntegerOption(gnosisDotsBuilder)
    .addIntegerOption(mageArcanaDotsBuilder)
    .addStringOption(spellTypeOptionsBuilder)
    .addIntegerOption(practiceOptionsBuilder)
    .addStringOption(primaryFactorOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({
        ephemeral: true,
    })
    const spellType = interaction.options.getString(
        SPELL_TYPE_OPTION_NAME,
    ) as NonRoteSpellTypeChoiceValue
    const practiceDots = interaction.options.getInteger(PARCTICE_OPTION_NAME)
    const gnosisDots = interaction.options.getInteger(GNOSIS_DOTS_OPTION_NAME)
    const mageArcanaDots = interaction.options.getInteger(
        MAGE_ARCANA_DOTS_OPTION_NAME,
    )
    const primaryFactor = interaction.options.getString(
        PRIMARY_FACTOR_OPTION_NAME,
    ) as PrimaryFactorChoiceValue | null

    if (
        !practiceDots ||
        !gnosisDots ||
        !mageArcanaDots ||
        spellType === null ||
        primaryFactor === null
    ) {
        console.error(
            `Some data not provided`,
            JSON.stringify({
                practiceDots,
                gnosisDots,
                mageArcanaDots,
                primaryFactor,
                spellType,
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
        spellType,
        manaCost: 0,
        diceToRoll: gnosisDots + mageArcanaDots,
        reachUsed: 0,
    }
    const freeReach = mageArcanaDots - practiceDots + 1

    // ruling arcana
    if (spellType === `improvised_not_ruling_arcana`) {
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
        content: getSpellResultContent(await getUserNickname(interaction), {
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
