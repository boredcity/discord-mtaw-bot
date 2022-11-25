import { StringId, numberFrom0to5, numberFrom1to5 } from '../commonTypes'
import { ArcanaName } from './arcaneName'
import { AttributeName } from './attributeName'
import { ConditionName } from './conditionName'
import { PracticeName } from './practiceName'
import { SkillName } from './skillName'
import { TiltName } from './tiltName'
import { ViceName } from './viceName'
import { VirtueName } from './virtueName'

export type PrimaryFactorChoiceValue = `duration` | `potency`
export type ChronicleName = string

interface SpendableWithGetter {
    get max(): number
    current: number
}

export type PlayerInfo = {
    name: string
    characters: {
        character: Character
        chronicle: ChronicleName
    }[]
}

export interface Character {
    name: string
    concept: string
    virtue: VirtueName
    vice: ViceName
    attributes: Map<AttributeName, numberFrom1to5>
    skills: Map<SkillName, numberFrom0to5>
    size: number
    armor: number
    get speed(): number
    get defense(): number
    get initiativeMod(): number
    beats: number
    experience: number
    health: SpendableWithGetter
    willPower: SpendableWithGetter
    additionalInfo: string
}

type PathName = `acanthus` | `mastigos` | `moros` | `obrimos` | `thyrsus`
type OrderName =
    | `adamantine arrow`
    | `guardians of the veil`
    | `mysterium`
    | `silver ladder`
    | `free council`
    | `seers of the throne`
// TODO: maybe, add nameless orders and specific prelacies later

type LegacyName = string

export interface Mage extends Character {
    type: `mage`
    path: PathName
    order: OrderName | `none`
    legacy: LegacyName
    arcana: Map<ArcanaName, numberFrom0to5>
    knownRotes: {
        description: RoteDescription
        roteSkill: SkillName
    }[]
    arcaneBeats: number
    arcaneExperience: number
    gnosis: number
    mana: SpendableWithGetter
    wisdom: number
    obsessions: string[]
    aspirations: string[]
    tilts: TiltName[]
    conditions: ConditionName[]
}

export const isMage = (char: Character): char is Mage => `gnosis` in char

export type ArcanaDescription = {
    arcana: ArcanaName
    level: number
}

export type PracticeDescription =
    | PracticeName
    | `${PracticeName}/${PracticeName}`

export type RoteDescription = ArcanaDescription & {
    id: StringId
    name: string
    practice: PracticeDescription
    primaryFactor: PrimaryFactorChoiceValue
    withstand?:
        | `resolve`
        | `stamina`
        | `composure`
        | `rank`
        // TODO: Should check the rest of this field values against the book
        | string
    description: string
    source: string
    secondaryRequiredArcana?: ArcanaDescription
}
