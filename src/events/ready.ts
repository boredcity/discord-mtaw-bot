import type { ClientEventHandler } from './index'

export const READY_HANDLER: ClientEventHandler<`ready`> = {
    eventName: `ready`,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`)
    },
}
