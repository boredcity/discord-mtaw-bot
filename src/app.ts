import { Client, GatewayIntentBits } from 'discord.js'
import { envs } from './envs'
import { ALL_EVENT_HANDLERS } from './events'
import { mageStore } from './storage/local/mageRepo'
import { playerStore } from './storage/local/playerRepo'

async function main() {
    console.log(`Bot is starting...`)

    await Promise.all([playerStore.readyPromise, mageStore.readyPromise])

    console.log(`Stores loaded...`)

    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    })

    for (const handler of ALL_EVENT_HANDLERS) {
        client[handler.once ? `once` : `on`](
            handler.eventName,
            async (...args) => {
                try {
                    console.log(`Handling ${handler.eventName}`)
                    if (
                        `isChatInputCommand` in args[0] &&
                        args[0].isChatInputCommand()
                    ) {
                        const cmd = args[0]
                        if (envs.NODE_ENV === `development`) {
                            console.log(
                                `Handling /${
                                    cmd.commandName
                                } with options ${JSON.stringify(
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (cmd.options as any)?.[`_hoistedOptions`],
                                )}`,
                            )
                        }
                    }
                    // TODO: try to make typesafe
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await handler.execute(...(args as any))
                } catch (err) {
                    console.log(err)
                }
            },
        )
    }

    client.login(envs.BOT_TOKEN)
}

main()