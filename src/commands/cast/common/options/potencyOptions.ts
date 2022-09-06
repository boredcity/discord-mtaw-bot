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

export const POTENCY_OPTION_NAME = `potency`
export type PotencyChoiceValue = `a${number}` | `${number}`

export const getPotencyChoices = (
    freeSteps: number,
): (SelectMenuComponentOptionData & SelectedValue<PotencyChoiceValue>)[] => [
    ...Array.from({ length: 5 })
        .map((_, i) => {
            const potency = i + 1
            const diceCost = Math.max(0, i - freeSteps) * 2
            return {
                value: `${potency}` as PotencyChoiceValue,
                label: `${potency} (-${diceCost} dice)`,
                effect: { dice: -diceCost, reach: 0, mana: 0 },
            }
        })
        .slice(freeSteps),
    ...Array.from({ length: 5 })
        .map((_, i) => {
            const potency = i + 1
            const diceCost = Math.max(0, i - freeSteps) * 2
            return {
                value: `a${potency}` as PotencyChoiceValue,
                label: `${potency}, -2 Withstand (-${diceCost} dice, 1 Reach)`,
                effect: { dice: -diceCost, reach: 1, mana: 0 },
            }
        })
        .slice(freeSteps),
]

export const getPotencyOptionsBuilder = (
    potencyChoices: SelectMenuComponentOptionData[],
) => {
    return new SelectMenuBuilder()
        .setCustomId(`select_potency`)
        .setPlaceholder(`Select potency`)
        .addOptions(potencyChoices)
}

export const getPotencyValue = async ({
    interaction,
    potencyChoices,
    currentSpellInfoText,
}: {
    interaction: ChatInputCommandInteraction
    currentSpellInfoText: string
    potencyChoices: (SelectedValue<PotencyChoiceValue> &
        SelectMenuComponentOptionData)[]
}): Promise<SelectedValue<PotencyChoiceValue>> => {
    const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getPotencyOptionsBuilder(potencyChoices),
        )
    const msg = await interaction.editReply({
        components: [row],
        content: `${currentSpellInfoText}How powerful should the spell be?`,
    })

    const values = (
        await msg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: 120000,
        })
    ).values as PotencyChoiceValue[]

    return getSelectedValues(potencyChoices, values)[0]
}
