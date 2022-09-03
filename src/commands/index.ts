import {
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

export interface LocalizationWithDefault
    extends Partial<Record<Locale, string>> {
    default: string
}

export type BotCommand = {
    name: string
    description: LocalizationWithDefault
    builder:
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
        | SlashCommandSubcommandsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>
}

export const ALL_COMMANDS: BotCommand[] = [
    HELP_COMMAND,
    PING_COMMAND,
    ROLL_COMMAND,
    CHANCE_COMMAND,
    R_COMMAND,
].sort((c1, c2) => c1.name.localeCompare(c2.name))

export type ArrayOfOptions<T> = Readonly<
    {
        name: string
        value: T
        name_localizations: Partial<Record<Locale, string>>
    }[]
>
