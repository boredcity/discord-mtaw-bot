import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { HELP_COMMAND } from './help'
import { PING_COMMAND } from './ping'
import { CHANCE_COMMAND } from './diceRolls/chance'
import { R_COMMAND } from './diceRolls/r'
import { ROLL_COMMAND } from './diceRolls/roll'
import { CAST_IMPROVISED_COMMAND } from './cast/castImprovisedOrPraxis'
import {
    CAST_ROTE_AUTOCOMPLETE_COMMAND,
    CAST_ROTE_COMMAND,
} from './cast/castRote'
import {
    LOOKUP_ROTE_AUTOCOMPLETE_COMMAND,
    LOOKUP_ROTE_COMMAND,
} from './cast/findRote'

export interface LocalizationWithDefault
    extends Partial<Record<Locale, string>> {
    default: string
}

export type BotChatCommand = {
    name: string
    description: LocalizationWithDefault
    builder:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, `addSubcommand` | `addSubcommandGroup`>
        | SlashCommandSubcommandsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>
}

export type AutocompleteCommand = {
    name: string
    execute: (interaction: AutocompleteInteraction) => Promise<unknown>
}

export const ALL_CHAT_INTERACTION_COMMANDS: BotChatCommand[] = [
    HELP_COMMAND,
    PING_COMMAND,
    ROLL_COMMAND,
    CHANCE_COMMAND,
    R_COMMAND,
    CAST_ROTE_COMMAND,
    CAST_IMPROVISED_COMMAND,
    LOOKUP_ROTE_COMMAND,
].sort((c1, c2) => c1.name.localeCompare(c2.name))

export const ALL_AUTOCOMPLETE_COMMANDS: AutocompleteCommand[] = [
    CAST_ROTE_AUTOCOMPLETE_COMMAND,
    LOOKUP_ROTE_AUTOCOMPLETE_COMMAND,
]

export type ArrayOfOptions<T, Name = string> = Readonly<
    {
        name: Name
        value: T
        name_localizations?: Partial<Record<Locale, string>>
    }[]
>
