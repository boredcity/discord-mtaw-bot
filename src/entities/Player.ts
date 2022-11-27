import { Serializable, StringId } from '../commonTypes'
import { IPlayer } from '../wodTypes/common'

export class Player extends Serializable implements IPlayer {
    activeCharacterId?: string | undefined
    name: string
    id: StringId
    characterIds: StringId[]

    static fromJSON(data: object) {
        const info = data as IPlayer
        return new Player(
            info.id,
            info.name,
            info.characterIds,
            info.activeCharacterId,
        )
    }

    constructor(
        id: StringId,
        name: string,
        characterIds: StringId[],
        activeCharacterId: StringId | undefined,
    ) {
        super()
        this.id = id
        this.characterIds = characterIds
        this.name = name
        this.activeCharacterId = activeCharacterId
    }

    toJSON(): IPlayer {
        return {
            id: this.id,
            name: this.name,
            characterIds: this.characterIds,
            activeCharacterId: this.activeCharacterId,
        }
    }
}
