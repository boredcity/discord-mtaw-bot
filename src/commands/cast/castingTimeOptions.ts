import { SelectedValue } from './../common/getSelectedValues'
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    MessageActionRowComponentBuilder,
    SelectMenuBuilder,
} from 'discord.js'
import { getRitualDurationByGnosis, TimeDuration } from './gnosis'
import { YantraChoiceValue } from './yantraOptions'
import { getSameUserSelectInteractionFilter } from '../common/getSameUserSelectInteractionFilter'

export const IS_RULING_OPTION_NAME = 'is_ruling'

export const getCastingTimeInfo = (
    ritualDuration: TimeDuration,
    multiplier: number,
) => {
    const value = ritualDuration.value * multiplier
    let label = `${value} ${ritualDuration.unit}`
    if (ritualDuration.unit === 'minute(s)') {
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
                label: `${label} (+${bonus} ${bonus === 1 ? 'die' : 'dice'})`,
                value: `${multiplier}`,
            }
        }),
    ]
    if (!usesRunes) {
        options.unshift(
            {
                label: 'Quick spell (+0 dice, 1 Reach)',
                value: 'quick',
            },
            {
                label: 'Time in a Bottle (+0 dice, Time ●●●●, -1 Mana)',
                value: 'time_in_a_bottle',
            },
        )
    }

    return new SelectMenuBuilder()
        .setCustomId('select_casting_time')
        .setPlaceholder('Select spell casting time')
        .addOptions(options)
}

type AdvancedCastingTimeOptionValue = 'quick' | 'time_in_a_bottle'
type CastingTimeOptionValue = AdvancedCastingTimeOptionValue | `${number}`
export const isAdvancedCastingTimeValue = (
    value: string,
): value is AdvancedCastingTimeOptionValue =>
    value === 'quick' || value === 'time_in_a_bottle'

export type CastingTimeValue = SelectedValue<CastingTimeOptionValue> & {
    diceBonus: number
    reachCost: number
    manaCost: number
}

export const getCastingTimeValueAndInfo = async ({
    interaction,
    gnosisDots,
    yantraValues,
    additionalSympathyYantrasRequired,
}: {
    interaction: ChatInputCommandInteraction
    gnosisDots: number
    yantraValues: YantraChoiceValue[]
    additionalSympathyYantrasRequired: number
}): Promise<CastingTimeValue> => {
    // casting time:
    const ritualDuration = getRitualDurationByGnosis(gnosisDots)
    const castingTimeRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            getCastingTimeOptionsBuilder(
                ritualDuration,
                yantraValues.includes('runes'),
            ),
        )
    const castingTimeMsg = await interaction.editReply({
        components: [castingTimeRow],
        content: 'How quickly it needs to be cast?',
    })

    const value = (
        await castingTimeMsg.awaitMessageComponent({
            filter: getSameUserSelectInteractionFilter(interaction),
            componentType: ComponentType.SelectMenu,
            time: 120000,
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
        diceBonus: castingTimeInfo.bonus,
        label: castingTimeInfo.label,
        reachCost: 0,
        manaCost: 0,
        value: value as `${number}`,
    }
}

export const getQuickCastingTimeLabelAndCost = (
    value: AdvancedCastingTimeOptionValue,
    {
        yantraValues,
        additionalSympathyYantrasRequired,
    }: {
        yantraValues: YantraChoiceValue[]
        additionalSympathyYantrasRequired: number
    },
): {
    label: string
    diceBonus: 0
    reachCost: number
    manaCost: number
} => {
    // advanced casting time is limited by yantras count and mana spending
    // FIXME: add mana spending?
    const yantrasUsed = yantraValues.length + additionalSympathyYantrasRequired
    const isMantraUsed = yantraValues.includes('mantra')
    const minDurationByYantras = Math.max(yantrasUsed, isMantraUsed ? 2 : 1)
    return {
        label: `${minDurationByYantras} turn(s)`,
        diceBonus: 0,
        reachCost: value === 'quick' ? 1 : 0,
        manaCost: value === 'time_in_a_bottle' ? 1 : 0,
    }
}
