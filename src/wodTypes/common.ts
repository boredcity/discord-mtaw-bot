import {
    StringId,
    numberFrom0to5,
    numberFrom1to5,
    numberFrom1to10,
} from '../commonTypes'
import { ArcanaName } from './arcaneName'
import { AttributeName } from './attributeName'
import { ConditionName } from './conditionName'
import { PracticeName } from './practiceName'
import { SkillName } from './skillName'
import { TiltName } from './tiltName'
import { ViceName } from './viceName'
import { VirtueName } from './virtueName'
import { RuleChoiceValue } from './ruleChoiceValue'

export type PrimaryFactorChoiceValue = `duration` | `potency`
export type ChronicleName = string

export interface SpendableWithGetter {
    get max(): number
    current: number
}

export type RollInfo = {
    id: StringId
    diceCount: number
    rule: RuleChoiceValue
    isChanceRoll: boolean
    target: number
}

export type IPlayer = {
    id: StringId
    name: string
    activeCharacterId?: StringId
    characterIds: StringId[]
}

export interface ICharacter {
    readonly id: StringId
    rolls: RollInfo[]
    name: string
    concept: string
    virtue: VirtueName
    vice: ViceName
    attributes: Record<AttributeName, numberFrom1to5>
    skills: Record<
        SkillName,
        { value: numberFrom0to5; specializations: string[] }
    >
    readonly size: number
    armor: number
    get speed(): number
    get defense(): number
    get initiativeMod(): number
    beats: number
    experience: number
    health: SpendableWithGetter
    willpower: SpendableWithGetter
    additionalInfo: string
}

export type PathName = `acanthus` | `mastigos` | `moros` | `obrimos` | `thyrsus`
export type OrderName =
    | `adamantine arrow`
    | `guardians of the veil`
    | `mysterium`
    | `silver ladder`
    | `free council`
    | `seers of the throne`
// TODO: maybe, add nameless orders and specific prelacies later

export type OrderNameOption = OrderName | `none`

type LegacyName = string

export interface IMage extends ICharacter {
    readonly type: `mage`
    readonly path: PathName
    shadowName: string
    order: OrderNameOption
    legacy: LegacyName | `none`
    arcana: Record<ArcanaName, numberFrom0to5>
    knownRotes: {
        description: RoteDescription
        roteSkill: SkillName
    }[]
    arcaneBeats: number
    arcaneExperience: number
    gnosis: numberFrom1to10
    mana: SpendableWithGetter
    wisdom: number
    obsessions: string[]
    aspirations: string[]
    tilts: TiltName[]
    conditions: ConditionName[]
}
export type NeverEditableField = keyof Pick<IMage, `id` | `type` | `path`>

export type MageSTEditableFields = keyof Omit<
    IMage,
    NeverEditableField | MageSelfEditableField
>

export type MageSelfEditableField = keyof Pick<
    IMage,
    `additionalInfo` | `obsessions` | `aspirations`
>

export const isMage = (char: ICharacter): char is IMage => `gnosis` in char

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
