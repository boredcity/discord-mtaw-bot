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
import { AWAIT_DURATION } from '../constants'

export const DURATION_OPTION_NAME = `duration`

export type DurationChoiceValue =
    | `1_turn`
    | `2_turns`
    | `3_turns`
    | `5_turns`
    | `10_turns`
    | `20_turns`
    | `a_scene_or_hour`
    | `a_day`
    | `a_week`
    | `a_month`
    | `a_year`
    | `aa_indefinite`

export const getDurationChoices = (
    freeSteps = 0,
): (SelectMenuComponentOptionData & SelectedValue<DurationChoiceValue>)[] => {
    const basicDurations = [
        { value: `1_turn` as const, label: `1 Turn` },
        { value: `2_turns` as const, label: `2 Turns` },
        { value: `3_turns` as const, label: `3 Turns` },
        { value: `5_turns` as const, label: `5 Turns` },
        { value: `10_turns` as const, label: `10 Turns` },
        { value: `20_turns` as const, label: `20 Turns / 1 Minute` },
    ]
        .map(({ label, value }, i) => {
            const cost = Math.max(0, i - freeSteps) * 2
            return {
                value,
                label: (label += ` (-${cost} dice)`),
                effect: getEffect(-cost),
            }
        })
        .slice(freeSteps)

    const advancedDurations = [
        {
            value: `a_scene_or_hour` as const,
            label: `Scene / 1 Hour`,
        },
        { value: `a_day` as const, label: `Day` },
        { value: `a_week` as const, label: `Week` },
        { value: `a_month` as const, label: `Month` },
        { value: `a_year` as const, label: `Year` },
    ]
        .map(({ label, value }, i) => {
            const cost = Math.max(0, i - freeSteps) * 2
            return {
                value,
                label: (label += ` (-${cost} dice, 1 Reach)`),
                effect: getEffect(-cost, 1),
            }
        })
        .slice(freeSteps)

    const indefiniteCost = Math.max(0, 10 - freeSteps * 2)
    const indefiniteDuration = {
        value: `aa_indefinite` as const,
        label: `Indefinite (-${indefiniteCost} dice, -1 Mana, 2 Reach)`,
        effect: getEffect(-indefiniteCost, 2, 1),
    }

    return [...basicDurations, ...advancedDurations, indefiniteDuration]
}

export const getDurationOptionsBuilder = (
    durationChoices: SelectMenuComponentOptionData[],
) =>
    new SelectMenuBuilder()
        .setCustomId(`select_duration`)
        .setPlaceholder(`Select duration`)
        .addOptions(durationChoices)

export const getDurationValue = async ({
    interaction,
    durationChoices,
    currentSpellInfoText,
}: {
    currentSpellInfoText: string
    interaction: ChatInputCommandInteraction
    durationChoices: (SelectedValue<DurationChoiceValue> &
        SelectMenuComponentOptionData)[]
}): Promise<SelectedValue<DurationChoiceValue>> => {
    const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getDurationOptionsBuilder(durationChoices),
        )
    const msg = await interaction.editReply({
        content: `${currentSpellInfoText}How long should the spell work?`,
        components: [row],
    })

    const { values } = await msg.awaitMessageComponent({
        filter: getSameUserSelectInteractionFilter(interaction),
        componentType: ComponentType.SelectMenu,
        time: AWAIT_DURATION,
    })

    return getSelectedValues(
        durationChoices,
        values as DurationChoiceValue[],
    )[0]
}
