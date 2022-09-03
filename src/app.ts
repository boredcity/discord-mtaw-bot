import { Client, GatewayIntentBits } from 'discord.js'
import { envs } from './envs'
import { ALL_EVENT_HANDLERS } from './events'

console.log('Bot is starting...')

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
})

for (const handler of ALL_EVENT_HANDLERS) {
    client[handler.once ? 'once' : 'on'](handler.eventName, async (...args) => {
        try {
            console.log(`Handling ${handler.eventName}`)
            if (
                'isChatInputCommand' in args[0] &&
                args[0].isChatInputCommand()
            ) {
                const cmd = args[0]
                if (envs.NODE_ENV === 'development') {
                    console.log(
                        `Handling /${
                            cmd.commandName
                        } with options ${JSON.stringify(
                            // no types provided for private fields, use only for debug in development
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (cmd.options as any)?.['_hoistedOptions'],
                        )}`,
                    )
                }
            }
            // TODO(merelj): try to make typesafe
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await handler.execute(...(args as any))
        } catch (err) {
            console.log(err)
        }
    })
}

client.login(envs.BOT_TOKEN)
