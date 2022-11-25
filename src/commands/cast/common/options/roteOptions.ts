import { AutocompleteInteraction, SlashCommandStringOption } from 'discord.js'
import { rotesList, rotesMap } from '../../../rotesList'
import { getFullArcanaRequirementsString } from '../getFullArcanaRequirementsString'
export const ROTE_OPTION_NAME = `rote_name`

export type RoteChoiceValue = typeof rotesMap[string][`id`]

export const getRoteDataByName = (roteName: RoteChoiceValue) =>
    rotesMap[roteName]

export const roteOptionsBuilder = (option: SlashCommandStringOption) =>
    option
        .setRequired(true)
        .setName(ROTE_OPTION_NAME)
        .setNameLocalizations({
            ru: `назване_рутины`,
        })
        .setDescription(
            `What is the Rote's name? Valid options: "postcognition", "Life3", etc.`,
        )
        .setAutocomplete(true)

export const autocompleteRoteInput = async (
    interaction: AutocompleteInteraction,
) => {
    const focusedValue = interaction.options.getFocused().toLocaleLowerCase()
    const filtered = rotesList
        .filter((r) => r.name.toLocaleLowerCase().includes(focusedValue))
        .slice(0, 25)

    if (filtered.length < 25) {
        filtered.push(
            ...rotesList
                .filter((r) => (r.arcana + r.level).startsWith(focusedValue))
                .slice(0, 25 - filtered.length),
        )
    }
    await interaction.respond(
        filtered.map((r) => ({
            name: `${getFullArcanaRequirementsString(r)} ${r.name}`,
            value: r.id,
        })),
    )
}
