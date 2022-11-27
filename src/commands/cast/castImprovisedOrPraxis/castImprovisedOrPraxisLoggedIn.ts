import {
    practiceOptionsBuilder,
    PARCTICE_OPTION_NAME,
} from '../common/options/practiceOptions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../../index'
import {
    primaryFactorOptionsBuilder,
    PRIMARY_FACTOR_OPTION_NAME,
} from '../common/options/primaryFactorOptions'
import {
    defaultSpellFactors,
    getSpellResultContent,
    ImprovisedOrPraxisSpellInfo,
} from '../common/getSpellResult'
import { getSpellFactorsAndYantras } from '../common/getSpellFactorsAndYantras'
import {
    NonRoteSpellTypeChoiceValue,
    spellTypeOptionsBuilder,
    SPELL_TYPE_OPTION_NAME,
} from '../common/options/spellTypeOptions'
import { PrimaryFactorChoiceValue } from '../../../wodTypes/common'
import { ArcanaName } from '../../../wodTypes/arcaneName'
import { getCurrentMageCharacter } from '../../../storage/local/utils'
import {
    arcanaOptionsBuilder,
    ARCANA_OPTION_NAME,
} from '../common/options/arcanaOptions'

const name = `cast_improvised`

const description: LocalizationWithDefault = {
    default: `calculates dice, reach and mana needed to cast an improvised spell or Praxis`,
    ru: `рассчитывает, сколько кубов, Усилий и Маны нужно для создания импровизированного заклинания или Праксиса`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Cast improvised spell or Praxis`)
    .setDMPermission(false)
    .addStringOption(spellTypeOptionsBuilder)
    .addStringOption(arcanaOptionsBuilder)
    .addIntegerOption(practiceOptionsBuilder)
    .addStringOption(primaryFactorOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({
        ephemeral: true,
    })
    const spellType = interaction.options.getString(
        SPELL_TYPE_OPTION_NAME,
    ) as NonRoteSpellTypeChoiceValue
    const arcanaName = interaction.options.getString(
        ARCANA_OPTION_NAME,
    ) as ArcanaName
    const practiceDots = interaction.options.getInteger(PARCTICE_OPTION_NAME)
    const primaryFactor = interaction.options.getString(
        PRIMARY_FACTOR_OPTION_NAME,
    ) as PrimaryFactorChoiceValue | null

    if (
        !arcanaName ||
        !practiceDots ||
        spellType === null ||
        primaryFactor === null
    ) {
        console.error(
            `Some data not provided`,
            JSON.stringify({
                practiceDots,
                primaryFactor,
                spellType,
                arcanaName,
            }),
        )
        return interaction.editReply(`Ooops, something went wrong, sorry :(`)
    }

    const mage = await getCurrentMageCharacter(interaction)

    if (!mage) {
        return interaction.editReply(
            `Ooops, you don't have a current character, sorry :(`,
        )
    }

    const mageArcanaDots = mage.arcana[arcanaName]
    if (practiceDots > mageArcanaDots) {
        return interaction.editReply(`Not enough dots in the arcana :(`)
    }

    const spellInfo: ImprovisedOrPraxisSpellInfo = {
        ...defaultSpellFactors,
        practiceDots,
        spellType,
        manaCost: 0,
        diceToRoll: mage.gnosis + mageArcanaDots,
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
        gnosisDots: mage.gnosis,
        freeReach,
    })

    await interaction.editReply({
        components: [],
        content: `Calculating...`,
    })

    await interaction.followUp({
        ephemeral: false,
        components: [],
        content: getSpellResultContent(mage.shadowName, {
            freeReach,
            spellInfo,
            chosenYantras,
            gnosisDots: mage.gnosis,
        }),
    })
}

export const CAST_IMPROVISED_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}
