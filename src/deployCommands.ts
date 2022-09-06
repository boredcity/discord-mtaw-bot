import { Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { envs } from './envs'
import { ALL_CHAT_INTERACTION_COMMANDS } from './commands/index'

const commands = ALL_CHAT_INTERACTION_COMMANDS.map((command) =>
    command.builder.toJSON(),
)

const rest = new REST({ version: `10` }).setToken(envs.BOT_TOKEN)

;(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`,
        )

        await rest.put(
            Routes.applicationGuildCommands(envs.APP_ID, envs.GUILD_ID),
            { body: [] },
        )
        console.log(`Successfully deleted old guild commands.`)

        const data = await rest.put(
            Routes.applicationGuildCommands(envs.APP_ID, envs.GUILD_ID),
            { body: commands },
        )

        // global
        // await rest.put(Routes.applicationCommands(envs.APP_ID), { body: commands })

        console.log(
            `Successfully reloaded ${
                (data as unknown[])?.length
            } application (/) commands.`,
        )
    } catch (error) {
        console.error(error)
    }
})()
