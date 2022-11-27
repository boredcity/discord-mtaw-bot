import { playerStore } from './playerRepo'
import { Interaction } from 'discord.js'
import { Mage } from '../../entities/Mage'
import { mageStore } from './mageRepo'

export const getCurrentMageCharacter = async (
    interaction: Interaction,
): Promise<Mage | undefined> => {
    try {
        const userId = interaction.user.id
        const player = await playerStore.getById(userId)
        const mageId = player?.activeCharacterId
        if (!player) {
            throw Error(`Player with userId ${userId} not found`)
        }
        if (!mageId) {
            throw Error(`Active character for player ${userId} not found`)
        }
        const mage = await mageStore.getById(mageId)
        if (!mage) {
            throw Error(`Mage with id ${mageId} not found`)
        }
        return mage
    } catch (err) {
        console.error(err)
        return undefined
    }
}
