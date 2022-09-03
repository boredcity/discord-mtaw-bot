import { ALL_COMMANDS } from '../commands'
import type { ClientEventHandler } from './index'

export const INTERACTION_CREATE_HANDLER: ClientEventHandler<'interactionCreate'> =
    {
        eventName: 'interactionCreate',
        async execute(interaction) {
            if (!interaction.isChatInputCommand()) return
            const currentCommand = ALL_COMMANDS.find(
                (c) => c.name === interaction.commandName,
            )
            await currentCommand?.execute(interaction)
        },
    }
