import { pluralizeLabel } from './../../../common/pluralize'
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    MessageActionRowComponentBuilder,
    SelectMenuBuilder,
} from 'discord.js'
import { getSameUserSelectInteractionFilter } from '../../../common/getSameUserSelectInteractionFilter'
import { SelectedValue } from '../../../common/getSelectedValues'
import { AWAIT_DURATION } from '../constants'
import { getRitualDurationByGnosis, TimeDuration } from '../gnosisHelpers'
import { YantraChoiceValue } from './yantraOptions'

export const IS_RULING_OPTION_NAME = `is_ruling`

export const getCastingTimeInfo = (
    ritualDuration: TimeDuration,
    multiplier: number,
) => {
    const value = ritualDuration.value * multiplier
    let label = `${value} ${ritualDuration.unit}`
    if (ritualDuration.unit === `minute(s)`) {
        const hoursValue = Math.floor(value / 60)
        const minutesValue = value % 60
        const hoursLabel = `${hoursValue} hour(s)`
        const minutesLabel = `${minutesValue} minute(s)`
        if (!hoursValue) {
            label = minutesLabel
        } else if (!minutesValue) {
            label = hoursLabel
        } else {
            label = `${hoursLabel} ${minutesLabel}`
        }
    }
    return {
        label,
        bonus: multiplier - 1,
    }
}

export const getCastingTimeOptionsBuilder = (
    ritualDuration: TimeDuration,
    usesRunes: boolean,
) => {
    const options = [
        ...[1, 2, 3, 4, 5, 6].map((multiplier) => {
            const { label, bonus } = getCastingTimeInfo(
                ritualDuration,
                multiplier,
            )
            return {
                label: `${label} (+${pluralizeLabel(bonus, `die`, `dice`)})`,
                value: `${multiplier}`,
            }
        }),
    ]
    if (!usesRunes) {
        options.unshift(
            {
                label: `Quick spell (+0 dice, 1 Reach)`,
                value: `quick`,
            },
            {
                label: `Time in a Bottle (+0 dice, Time ●●●●, -1 Mana)`,
                value: `time_in_a_bottle`,
            },
        )
    }

    return new SelectMenuBuilder()
        .setCustomId(`select_casting_time`)
        .setPlaceholder(`Select spell casting time`)
        .addOptions(options)
}

type AdvancedCastingTimeChoiceValue = `quick` | `time_in_a_bottle`
export type CastingTimeChoiceValue =
    | AdvancedCastingTimeChoiceValue
    | `${number}`
export const isAdvancedCastingTimeValue = (
    value: string,
): value is AdvancedCastingTimeChoiceValue =>
    value === `quick` || value === `time_in_a_bottle`

export const getCastingTimeValue = async ({
    interaction,
    gnosisDots,
    yantraValues,
    currentSpellInfoText,
    additionalSympathyYantrasRequired,
}: {
    interaction: ChatInputCommandInteraction
    gnosisDots: number
    currentSpellInfoText: string
    yantraValues: YantraChoiceValue[]
    additionalSympathyYantrasRequired: number
}): Promise<SelectedValue<CastingTimeChoiceValue>> => {
    const ritualDuration = getRitualDurationByGnosis(gnosisDots)
    const castingTimeRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getCastingTimeOptionsBuilder(
                ritualDuration,
                yantraValues.includes(`runes`),
            ),
        )
    const castingTimeMsg = await interaction.editReply({
        components: [castingTimeRow],
        content: `${currentSpellInfoText}How quickly spell needs to be cast?`,
    })

    const value = (
        await castingTimeMsg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: AWAIT_DURATION,
        })
    ).values[0]

    if (isAdvancedCastingTimeValue(value)) {
        return {
            ...getQuickCastingTimeLabelAndCost(value, {
                yantraValues,
                additionalSympathyYantrasRequired,
            }),
            value,
        }
    }

    const castingTimeInfo = getCastingTimeInfo(ritualDuration, +value)
    return {
        label: castingTimeInfo.label,
        effect: { reach: 0, mana: 0, dice: castingTimeInfo.bonus },
        value: value as `${number}`,
    }
}

export const getQuickCastingTimeLabelAndCost = (
    value: AdvancedCastingTimeChoiceValue,
    {
        yantraValues,
        additionalSympathyYantrasRequired,
    }: {
        yantraValues: YantraChoiceValue[]
        additionalSympathyYantrasRequired: number
    },
) => {
    // NOTE: should I add mana spending? most dice come from negating paradox and it's not handled for now
    const yantrasUsed = yantraValues.length + additionalSympathyYantrasRequired
    const isMantraUsed = yantraValues.includes(`mantra`)
    const minDurationByYantras = Math.max(yantrasUsed, isMantraUsed ? 2 : 1)
    return {
        label: `${minDurationByYantras} turn(s)`,
        effect: {
            dice: 0,
            reach: value === `quick` ? 1 : 0,
            mana: value === `time_in_a_bottle` ? 1 : 0,
        },
    }
}
