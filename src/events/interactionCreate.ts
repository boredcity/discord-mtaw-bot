import { Interaction } from 'discord.js'
import { ClientEventHandler } from '.'
import {
    ALL_AUTOCOMPLETE_COMMANDS,
    ALL_CHAT_INTERACTION_COMMANDS,
} from '../commands'

export const INTERACTION_CREATE_HANDLER: ClientEventHandler<'interactionCreate'> =
    {
        eventName: 'interactionCreate',
        async execute(interaction: Interaction) {
            if (interaction.isAutocomplete()) {
                return ALL_AUTOCOMPLETE_COMMANDS.find(
                    (c) => c.name === interaction.commandName,
                )?.execute(interaction)
            } else if (interaction.isChatInputCommand()) {
                return ALL_CHAT_INTERACTION_COMMANDS.find(
                    (c) => c.name === interaction.commandName,
                )?.execute(interaction)
            }
        },
    }
