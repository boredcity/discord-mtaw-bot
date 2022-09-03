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
            // TODO(merelj): make typesafe
            console.log(
                `Handling ${handler.eventName} - ${(
                    args[0].toJSON() as object
                ).toString()}`,
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await handler.execute(...(args as any))
        } catch (err) {
            console.log(err)
        }
    })
}

client.login(envs.BOT_TOKEN)
