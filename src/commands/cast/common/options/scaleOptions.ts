import { pluralizeLabel } from './../../../common/pluralize'
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    MessageActionRowComponentBuilder,
    SelectMenuBuilder,
    SelectMenuComponentOptionData,
} from 'discord.js'
import { getSameUserSelectInteractionFilter } from '../../../common/getSameUserSelectInteractionFilter'
import {
    getSelectedValues,
    SelectedValue,
} from '../../../common/getSelectedValues'
import { AWAIT_DURATION } from '../constants'

export const SCALE_OPTION_NAME = `scale`
export type ScaleChoiceValue = `a${number}` | `${number}`
const baseScales = [
    {
        subjects: 1,
        sizeOfLargest: 5,
        area: `Arm's reach from a central point`,
        effect: { dice: -0, reach: 0, mana: 0 },
    },
    {
        subjects: 2,
        sizeOfLargest: 6,
        area: `A small room`,
        effect: { dice: -2, reach: 0, mana: 0 },
    },
    {
        subjects: 4,
        sizeOfLargest: 7,
        area: `A large room`,
        effect: { dice: -4, reach: 0, mana: 0 },
    },
    {
        subjects: 8,
        sizeOfLargest: 8,
        area: `Several rooms, or a single floor of a house`,
        effect: { dice: -6, reach: 0, mana: 0 },
    },
    {
        subjects: 16,
        sizeOfLargest: 9,
        area: `A ballroom or small house`,
        effect: { dice: -8, reach: 0, mana: 0 },
    },
]
const advancedScales = [
    {
        subjects: 5,
        sizeOfLargest: 5,
        area: `A large house or building`,
        effect: { dice: -0, reach: 1, mana: 0 },
    },
    {
        subjects: 10,
        sizeOfLargest: 10,
        area: `A small warehouse or parking lot`,
        effect: { dice: -2, reach: 1, mana: 0 },
    },
    {
        subjects: 20,
        sizeOfLargest: 15,
        area: `A large warehouse or supermarket`,
        effect: { dice: -4, reach: 1, mana: 0 },
    },
    {
        subjects: 40,
        sizeOfLargest: 20,
        area: `A small factory, or a shopping mall`,
        effect: { dice: -6, reach: 1, mana: 0 },
    },
    {
        subjects: 80,
        sizeOfLargest: 25,
        area: `A large factory, or a city block`,
        effect: { dice: -8, reach: 1, mana: 0 },
    },
    {
        subjects: 160,
        sizeOfLargest: 30,
        area: `A campus, or a small neighborhood`,
        effect: { dice: -10, reach: 1, mana: 0 },
    },
]

export const getScaleCost = (valueString: ScaleChoiceValue) => {
    if (valueString.startsWith(`a`)) {
        return {
            reach: 1,
            dice: +valueString.slice(1) * 2,
        }
    }
    return {
        reach: 0,
        dice: +valueString * 2,
    }
}

export const scaleChoices: (SelectedValue<ScaleChoiceValue> &
    SelectMenuComponentOptionData)[] = [
    ...baseScales.map((s, i) => ({
        value: `${i}` as ScaleChoiceValue,
        effect: s.effect,
        label: `${s.area} or ${pluralizeLabel(
            s.subjects,
            `man`,
            `men`,
        )} (up to Size ${s.sizeOfLargest}) (${s.effect.dice} dice)`,
    })),
    ...advancedScales.map((s, i) => ({
        value: (`a` + `${i}`) as ScaleChoiceValue,
        effect: s.effect,
        label: `${s.area} or ${s.subjects} men (up to Size ${s.sizeOfLargest}) (${s.effect.dice} dice, 1 Reach)`,
    })),
]

export const scaleOptionsBuilder = new SelectMenuBuilder()
    .setCustomId(`select_scale`)
    .setPlaceholder(`Select scale`)
    .addOptions(scaleChoices)

export const getScaleValue = async ({
    interaction,
    currentSpellInfoText,
}: {
    interaction: ChatInputCommandInteraction
    currentSpellInfoText: string
}): Promise<SelectedValue<ScaleChoiceValue>> => {
    const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            scaleOptionsBuilder,
        )
    const msg = await interaction.editReply({
        components: [row],
        content: `${currentSpellInfoText}How huge should the spell be?`,
    })

    const values = (
        await msg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: AWAIT_DURATION,
        })
    ).values as ScaleChoiceValue[]

    return getSelectedValues(scaleChoices, values)[0]
}
