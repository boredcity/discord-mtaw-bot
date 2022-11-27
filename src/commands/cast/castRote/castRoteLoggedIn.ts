import { SlashCommandBuilder } from '@discordjs/builders'
import { ChatInputCommandInteraction } from 'discord.js'
import { BotChatCommand, LocalizationWithDefault } from '../../index'
import {
    roteOptionsBuilder,
    getRoteDataByName,
    ROTE_OPTION_NAME,
    RoteChoiceValue,
    autocompleteRoteInput,
} from '../common/options/roteOptions'
import {
    RoteSpellInfo,
    getSpellResultContent,
    defaultSpellFactors,
} from '../common/getSpellResult'
import { getSpellFactorsAndYantras } from '../common/getSpellFactorsAndYantras'
import { getUserNickname } from '../../common/getUserNickname'
import { RoteDescription } from '../../../wodTypes/common'
import {
    skillOptionsBuilder,
    SKILL_OPTION_NAME,
} from '../common/options/mudraSkillOptions'
import { getCurrentMageCharacter } from '../../../storage/local/utils'
import { SkillName } from '../../../wodTypes/skillName'

const name = `cast_rote`

const description: LocalizationWithDefault = {
    default: `calculates dice, reach and mana needed to cast a Rote`,
    ru: `рассчитывает, сколько кубов, Усилий и Маны нужно для создания Рутины`,
}

const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Cast Rote`)
    .setDMPermission(false)
    .addStringOption(roteOptionsBuilder)
    .addStringOption(skillOptionsBuilder)

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({
        ephemeral: true,
    })
    const roteName = interaction.options.getString(
        ROTE_OPTION_NAME,
    ) as RoteChoiceValue
    const mudraSkill = interaction.options.getString(
        SKILL_OPTION_NAME,
    ) as SkillName | null

    const mage = await getCurrentMageCharacter(interaction)
    const roteData: RoteDescription | undefined = getRoteDataByName(roteName)

    if (!mage) {
        return interaction.editReply(`Ooops, couldn't find your mage, sorry :(`)
    }

    if (!roteName || !roteData) {
        return interaction.editReply(`Rote "${roteName}" not found :(`)
    }

    const mageArcanaDots = mage.arcana[roteData.arcana]
    if (roteData.level > mageArcanaDots) {
        return interaction.editReply(`Not enough dots in the arcana :(`)
    }

    const spellInfo: RoteSpellInfo = {
        ...defaultSpellFactors,
        ...roteData,
        spellType: `rote`,
        manaCost: 0,
        diceToRoll: mage.gnosis + mageArcanaDots,
        reachUsed: 0,
    }
    const freeReach = 5 - roteData.level + 1

    // + add order specialization skill value
    const mudraSkillDots = mudraSkill
        ? mage.skills[mudraSkill].value
        : undefined

    const { chosenYantras } = await getSpellFactorsAndYantras({
        interaction,
        mageArcanaDots,
        primaryFactor: spellInfo.primaryFactor,
        spellInfo,
        gnosisDots: mage.gnosis,
        mudraSkillDots,
        freeReach,
    })

    await interaction.editReply({
        components: [],
        content: `Calculating...`,
    })

    await interaction.followUp({
        ephemeral: false,
        content: getSpellResultContent(await getUserNickname(interaction), {
            freeReach,
            spellInfo,
            chosenYantras,
            gnosisDots: mage.gnosis,
        }),
    })
}

export const CAST_ROTE_COMMAND: BotChatCommand = {
    name,
    description,
    builder,
    execute,
}

export const CAST_ROTE_AUTOCOMPLETE_COMMAND = {
    name: `cast_rote`,
    execute: autocompleteRoteInput,
}
