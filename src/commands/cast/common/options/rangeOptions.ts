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
    getEffect,
    getSelectedValues,
    SelectedValue,
} from '../../../common/getSelectedValues'

export const RANGE_OPTION_NAME = `range`
export type RangeChoiceValue = `standard` | `sensory` | `sympathetic`

export const getRangeCost = (value: RangeChoiceValue) => {
    if (value === `sensory`) return { reach: 1, mana: 0 }
    if (value === `sympathetic`) return { reach: 1, mana: 1 }
    return { reach: 0, mana: 0 }
}

export const rangeChoices: (SelectMenuComponentOptionData &
    SelectedValue<RangeChoiceValue>)[] = [
    { value: `standard`, label: `Self/touch or Aimed`, effect: getEffect(0) },
    { value: `sensory`, label: `Sensory (1 Reach)`, effect: getEffect(0, 1) },
    {
        value: `sympathetic`,
        effect: getEffect(0, 1, 1),
        label: `Sympathetic Range (needs Space ●● and Yantra; 1 Reach, -1 Mana)`,
    },
    // TODO: should I add temporal sympathy?
]

export const rangeOptionsBuilder = new SelectMenuBuilder()
    .setCustomId(`select_range`)
    .setPlaceholder(`Select range`)
    .addOptions(rangeChoices)

export const getRangeValue = async ({
    interaction,
    currentSpellInfoText,
}: {
    currentSpellInfoText: string
    interaction: ChatInputCommandInteraction
}): Promise<SelectedValue<RangeChoiceValue>> => {
    const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            rangeOptionsBuilder,
        )
    const msg = await interaction.editReply({
        components: [row],
        content: `${currentSpellInfoText}What is the spell's range?`,
    })

    const values = (
        await msg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: 120000,
        })
    ).values as RangeChoiceValue[]

    return getSelectedValues(rangeChoices, values)[0]
}
