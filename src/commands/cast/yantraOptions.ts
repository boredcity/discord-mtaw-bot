import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    MessageActionRowComponentBuilder,
    SelectMenuBuilder,
    SelectMenuComponentOptionData,
} from 'discord.js'
import { getSameUserSelectInteractionFilter } from '../common/getSameUserSelectInteractionFilter'
import { getSelectedValues, SelectedValue } from '../common/getSelectedValues'
import { getMaxYantrasByGnosis } from './gnosis'

export type YantraChoiceValue =
    | `location`
    | `demesne`
    | `verge`
    | `concentration`
    | `mantra`
    | `runes`
    | `mudra`
    | `dedicated_tool`
    | `tool`
    | `material_sympathy`
    | `representational_sympathy`
    | `sacrament1`
    | `sacrament2`
    | `sacrament3`
    | `persona1`
    | `persona2`
    | `persona3`
    | `required_sympathy`
    | `nothing`
// plus required sympathy tool at +0

export const getYantraChoices = (
    mudraSkillValue?: number,
): (SelectMenuComponentOptionData & {
    diceBonus: number
} & SelectedValue<YantraChoiceValue>)[] => {
    const locationYantras = [
        {
            label: `Location (+1 die)`,
            description: `A place and time symbolically linked to the spell`,
            value: `location`,
            diceBonus: 1,
        },
        {
            label: `Demesne (+2 dice)`,
            description: `A prepared ritual space with a soul stone`,
            value: `demesne`,
            diceBonus: 2,
        },
        {
            label: `Supernal Verge (+2 dice)`,
            description: `A place where the Supernal touches the Fallen World.`,
            value: `verge`,
            diceBonus: 2,
        },
    ] as const

    const actionYantras: (SelectMenuComponentOptionData & {
        diceBonus: number
    } & SelectedValue<YantraChoiceValue>)[] = [
        {
            label: `Concentration (+2 dice)`,
            description: `Concentrate for the whole spell's duration`,
            value: `concentration` as const,
            diceBonus: 2,
        },
        {
            label: `Mantra (High Speech) (+2 dice)`,
            description: `Must be spoken aloud. Cannot be used reflexively.`,
            value: `mantra` as const,
            diceBonus: 2,
        },
        {
            label: `Runes (+2 dice)`,
            description: `Marked object with runes. Ritual casting only. Damaging runes ends spell.`,
            value: `runes` as const,
            diceBonus: 2,
        },
    ]

    if (mudraSkillValue) {
        actionYantras.unshift({
            label: `Rote Skill Mudra (+${mudraSkillValue} dice)`,
            description: `Use skill dots in the Rote skill (+1 for order Rote skills dice)`,
            value: `mudra` as const,
            diceBonus: mudraSkillValue,
        })
    }

    const toolYantras = [
        {
            label: `Dedicated Tool (-2 Paradox dice)`,
            description: `Item synchronized with mage's Nimbus.`,
            value: `dedicated_tool`,
            diceBonus: 0,
        },
        {
            label: `Path or Order Tool (+1 die)`,
            description: `Tools aligned closely to Path or Order.`,
            value: `tool`,
            diceBonus: 1,
        },
        {
            label: `Material Sympathy (+2 dice)`,
            description: `Item linked to subject "as they are now".`,
            value: `material_sympathy`,
            diceBonus: 2,
        },
        {
            label: `Representational Sympathy (+1 die)`,
            description: `Item linked to subject "as they were previously".`,
            value: `representational_sympathy`,
            diceBonus: 1,
        },
    ] as const

    const meritDependentYantras = [
        {
            label: `Sacrament (+1 dice)`,
            description: `Symbolic object mage destroys during casting.`,
            value: `sacrament1`,
            diceBonus: 1,
        },
        {
            label: `Rare sacrament (+2 die)`,
            value: `sacrament2`,
            diceBonus: 2,
        },
        {
            label: `Supernal sacrament (+3 dice)`,
            value: `sacrament3`,
            diceBonus: 3,
        },
        {
            label: `Persona (+1 dice)`,
            description: `Based on Shadow Name or Cabal Theme Merit.`,
            value: `persona1`,
            diceBonus: 1,
        },
        {
            label: `Persona (+2 dice)`,
            value: `persona2`,
            diceBonus: 2,
        },
        {
            label: `Persona (+3 dice)`,
            value: `persona3`,
            diceBonus: 3,
        },
    ] as const
    return [
        noYantra,
        ...actionYantras,
        ...toolYantras,
        ...locationYantras,
        ...meritDependentYantras,
    ]
}

export const requiredSympatheticYantra: {
    diceBonus: number
} & SelectedValue<YantraChoiceValue> = {
    diceBonus: 0,
    value: `required_sympathy`,
    label: `Required sympathetic yantra (+0 dice)`,
}

const noYantra: {
    diceBonus: number
} & SelectedValue<YantraChoiceValue> = {
    diceBonus: 0,
    value: `nothing`,
    label: `Nothing (+0 dice)`,
}

export const getYantraOptionsBuilder = (
    yantraChoices: SelectMenuComponentOptionData[],
    maxCount: number,
) =>
    new SelectMenuBuilder()
        .setCustomId(`select_yantras`)
        .setPlaceholder(`Select yantras`)
        .setMaxValues(maxCount)
        .addOptions(yantraChoices)

export const getYantraValues = async ({
    interaction,
    mudraSkillDots,
    gnosisDots,
    additionalSympathyYantrasRequired,
}: {
    interaction: ChatInputCommandInteraction
    mudraSkillDots?: number
    gnosisDots: number
    additionalSympathyYantrasRequired: number
}): Promise<({ diceBonus: number } & SelectedValue<YantraChoiceValue>)[]> => {
    const yantraChoices = getYantraChoices(mudraSkillDots)
    const maxCount =
        getMaxYantrasByGnosis(gnosisDots) - additionalSympathyYantrasRequired
    const yantrasRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getYantraOptionsBuilder(yantraChoices, maxCount),
        )
    const yantrasMsg = await interaction.editReply({
        components: [yantrasRow],
        content: `What helps the spell to blossom?`,
    })

    const values = (
        await yantrasMsg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: 120000,
        })
    ).values as YantraChoiceValue[]

    const chosenYantras = getSelectedValues(yantraChoices, values)

    while (additionalSympathyYantrasRequired > 0) {
        additionalSympathyYantrasRequired--
        chosenYantras.push(requiredSympatheticYantra)
    }

    return chosenYantras
}
