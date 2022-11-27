/* eslint-disable brace-style */
import EventEmitter from 'events'
import { StringId } from '../commonTypes'

export type EventType = `create` | `update`
export interface IRepo<XInstanceType, XCreationPayload> {
    readyPromise: Promise<void>
    create(createPayload: XCreationPayload): Promise<XInstanceType>
    getById(id: StringId): Promise<XInstanceType | undefined>
    update(updatePayload: XInstanceType): Promise<XInstanceType>
    subscribe(eventType: EventType, cb: (data: XInstanceType) => void): void
}

export abstract class BaseRepo<XInstanceType, XCreationPayload>
    implements IRepo<XInstanceType, XCreationPayload>
{
    public readyPromise: Promise<void>
    protected readyResolver?: () => void
    protected readyRejecter?: (err: unknown) => void
    private getEventName = (eventType: EventType) =>
        `${this.eventBaseName}_${eventType}`
    protected notify(eventType: EventType, data: XInstanceType) {
        this.#eventEmitter.emit(this.getEventName(eventType), data)
    }
    #eventEmitter: EventEmitter
    subscribe(eventType: EventType, cb: (data: XInstanceType) => void) {
        this.#eventEmitter.addListener(this.getEventName(eventType), cb)
    }

    constructor(private eventBaseName: string) {
        this.#eventEmitter = new EventEmitter()
        this.readyPromise = new Promise((res, rej) => {
            this.readyResolver = res
            this.readyRejecter = rej
        })
    }

    abstract getById(id: StringId): Promise<XInstanceType | undefined>
    abstract update(updatePayload: XInstanceType): Promise<XInstanceType>
    abstract create(createPayload: XCreationPayload): Promise<XInstanceType>
}
