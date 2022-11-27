import { StringId } from '../../commonTypes'
import { Player } from '../../entities/Player'
import { LocalFileRepo } from './localFileRepo'

export const playerStore = new LocalFileRepo(
    `players`,
    `0.0.1`,
    Player,
    ({ id, name }: { id: StringId; name: string }) =>
        new Player(id, name, [], undefined),
)
