import { ClientEvents } from 'discord.js'
import { INTERACTION_CREATE_HANDLER } from './interactionCreate'
import { READY_HANDLER } from './ready'

export type ClientEventHandler<K extends keyof ClientEvents> = {
    eventName: K
    once?: boolean
    execute: (...args: ClientEvents[K]) => void
}

export const ALL_EVENT_HANDLERS = [READY_HANDLER, INTERACTION_CREATE_HANDLER]
