/* eslint-disable brace-style */

import { Serializable, StringId } from '../../commonTypes'
import { BaseRepo } from '../repo'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export class LocalFileRepo<
    XCreationPayload,
    XInstanceType extends Serializable,
> extends BaseRepo<XInstanceType, XCreationPayload> {
    private fileDirectoryPath: string
    private filePath: string
    private store: Record<StringId, object> = {}

    constructor(
        storageKey: string,
        version: string,
        private serializableConstructor: {
            fromJSON: (data: object) => XInstanceType
        },
        private createPayloadMapper: (x: XCreationPayload) => XInstanceType,
    ) {
        super(storageKey)
        this.fileDirectoryPath = path.join(
            `local_file_storage`,
            `v${version}`,
            storageKey,
        )
        this.filePath = path.join(this.fileDirectoryPath, `store.json`)

        this.readToStore().then(this.readyResolver)
    }

    readToStore = async () => {
        const buffer = await this.readyFile()
        await this.parseFileIntoStore(buffer)
    }

    private parseFileIntoStore = (buffer: Buffer) => {
        if (!buffer) return
        const json: Record<StringId, object> = JSON.parse(buffer.toString())
        this.store = json
    }

    private readyFile = async (): Promise<Buffer> => {
        try {
            return await readFile(this.filePath)
        } catch (error) {
            try {
                await mkdir(this.fileDirectoryPath, { recursive: true })
            } catch (err) {
                if ((err as NodeJS.ErrnoException).code !== `EEXISTS`) {
                    this.readyRejecter?.(err)
                    throw err
                }
            }
            try {
                await writeFile(this.filePath, JSON.stringify({}))
                return await readFile(this.filePath)
            } catch (err) {
                this.readyRejecter?.(err)
                throw err
            }
        }
    }

    async synchronizeStore() {
        await writeFile(this.filePath, JSON.stringify(this.store, null, 4))
        await this.readToStore()
    }

    async getById(id: StringId): Promise<XInstanceType | undefined> {
        await this.readyPromise
        const found = this.store[id]
        if (!found) return undefined
        return this.serializableConstructor.fromJSON(found)
    }

    async update(updatePayload: XInstanceType): Promise<XInstanceType> {
        const payload = updatePayload as Serializable
        this.store[payload.id] = {
            ...updatePayload.toJSON(),
            updated: new Date().toISOString(),
        }
        await this.synchronizeStore()
        const saved = await this.getById(updatePayload.id)
        if (!saved) {
            throw new Error(`Cannot find created entity in store`)
        }
        this.notify(`update`, saved)
        return saved
    }

    async create(createPayload: XCreationPayload): Promise<XInstanceType> {
        const payload = this.createPayloadMapper(createPayload)
        if (this.store[payload.id] !== undefined) {
            throw new Error(
                `Cannot create entity with duplicate id ${payload.id}`,
            )
        }
        const result = await this.update(payload)
        this.notify(`create`, result)
        return result
    }
}
