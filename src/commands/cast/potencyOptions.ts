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
import { getCurrentSpellCost } from './getSpellFactorsAndYantras'
import { SpellInfo } from './getSpellResult'

export const POTENCY_OPTION_NAME = `potency`
export type PotencyChoiceValue = `a${number}` | `${number}`

export const getPotencyCost = (
    valueString: PotencyChoiceValue,
    freeSteps: number,
) => {
    let reach = 0
    if (valueString.startsWith(`a`)) {
        reach = 1
    }
    let potencyDotsBought = +valueString.slice(-1)
    if (reach !== null) {
        potencyDotsBought -= 2
    }
    potencyDotsBought -= freeSteps
    return {
        reach: 0,
        dice: potencyDotsBought * 2,
    }
}

export const getPotencyChoices = (
    freeSteps: number,
): (SelectMenuComponentOptionData & SelectedValue<PotencyChoiceValue>)[] => [
    ...Array.from({ length: 5 })
        .map((_, i) => ({
            value: `${i + 1}` as PotencyChoiceValue,
            label: `${i + 1} (-${Math.max(0, i - freeSteps) * 2} dice)`,
        }))
        .slice(freeSteps),
    ...Array.from({ length: 5 })
        .map((_, i) => ({
            value: `a${i + 1}` as PotencyChoiceValue,
            label: `${i + 3} (-${
                Math.max(0, i - freeSteps) * 2
            } dice, 1 Reach)`,
        }))
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
    currentSpellCosts,
}: {
    interaction: ChatInputCommandInteraction
    currentSpellCosts: string
    potencyChoices: (SelectedValue<PotencyChoiceValue> &
        SelectMenuComponentOptionData)[]
}): Promise<SelectedValue<PotencyChoiceValue>> => {
    const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getPotencyOptionsBuilder(potencyChoices),
        )
    const msg = await interaction.editReply({
        components: [row],
        content: `${currentSpellCosts}How powerful should the spell be?`,
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
