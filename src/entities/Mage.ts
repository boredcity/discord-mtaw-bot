import {
    numberFrom0to5,
    numberFrom1to10,
    numberFrom1to5,
    Serializable,
    StringId,
} from '../commonTypes'
import { getManaLimit } from '../gnosisHelpers'
import { ArcanaName } from '../wodTypes/arcaneName'
import { AttributeName } from '../wodTypes/attributeName'
import {
    IMage,
    SpendableWithGetter,
    RoteDescription,
    OrderNameOption,
    RollInfo,
} from '../wodTypes/common'
import { SkillName } from '../wodTypes/skillName'
import { PathName } from '../wodTypes/common'

export class Mage extends Serializable implements IMage {
    readonly type = `mage` as const
    id!: StringId
    path!: PathName
    order!: OrderNameOption
    legacy!: string
    arcana!: Record<ArcanaName, numberFrom0to5>
    knownRotes!: { description: RoteDescription; roteSkill: SkillName }[]
    arcaneBeats!: number
    arcaneExperience!: number
    gnosis!: numberFrom1to10
    wisdom!: number
    obsessions!: string[]
    aspirations!: string[]
    tilts!: string[]
    conditions!: string[]
    name!: string
    shadowName!: string
    concept!: string
    virtue!: string
    vice!: string
    attributes!: Record<AttributeName, numberFrom1to5>
    skills!: Record<
        SkillName,
        { value: numberFrom0to5; specializations: string[] }
    >
    size!: number
    armor!: number
    beats!: number
    experience!: number
    additionalInfo!: string
    rolls!: RollInfo[]

    static fromJSON(data: object) {
        const info = data as IMage
        return new Mage(info)
    }

    get speed(): number {
        return this.attributes.dexterity + this.attributes.strength + 5
    }
    get defense(): number {
        return (
            Math.min(this.attributes.dexterity, this.attributes.wits) +
            this.skills.athletics.value
        )
    }
    get initiativeMod(): number {
        return this.attributes.dexterity + this.attributes.composure
    }
    health: SpendableWithGetter
    willpower: SpendableWithGetter
    mana: SpendableWithGetter

    constructor(
        data: Omit<IMage, `type` | `speed` | `defense` | `initiativeMod`>,
    ) {
        super()
        Object.assign(this, data)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this
        this.health = {
            current: data.health.current ?? data.attributes.stamina + data.size,
            get max() {
                return outerThis.attributes.stamina + outerThis.size
            },
        }

        this.willpower = {
            current:
                data.willpower.current ??
                data.attributes.resolve + data.attributes.composure,
            get max() {
                return (
                    outerThis.attributes.resolve +
                    outerThis.attributes.composure
                )
            },
        }

        this.mana = {
            current: data.mana.current ?? getManaLimit(data.gnosis),
            get max() {
                return getManaLimit(outerThis.gnosis)
            },
        }
    }

    toJSON(): IMage {
        return this
    }
}

export type BasicMageInfo = Pick<
    IMage,
    `name` | `path` | `order` | `virtue` | `vice` | `concept` | `shadowName`
>
export const getEmptyMageTemplate = ({
    name,
    path,
    order,
    virtue,
    shadowName,
    vice,
    concept,
}: BasicMageInfo) =>
    new Mage({
        id: new Date().toISOString(),
        name,
        shadowName,
        rolls: [],
        path,
        order,
        virtue,
        vice,
        concept,
        legacy: `none`,
        arcana: {
            death: 0,
            life: 0,
            forces: 0,
            fate: 0,
            matter: 0,
            mind: 0,
            prime: 0,
            space: 0,
            spirit: 0,
            time: 0,
        },
        knownRotes: [],
        arcaneBeats: 0,
        arcaneExperience: 0,
        gnosis: 1,
        wisdom: 7,
        obsessions: [],
        aspirations: [],
        tilts: [],
        conditions: [],
        attributes: {
            strength: 1,
            dexterity: 1,
            stamina: 1,
            presense: 1,
            manipulation: 1,
            composure: 1,
            intelligence: 1,
            wits: 1,
            resolve: 1,
        },
        skills: {
            athletics: {
                value: 0,
                specializations: [],
            },
            brawl: {
                value: 0,
                specializations: [],
            },
            drive: {
                value: 0,
                specializations: [],
            },
            firearms: {
                value: 0,
                specializations: [],
            },
            larceny: {
                value: 0,
                specializations: [],
            },
            stealth: {
                value: 0,
                specializations: [],
            },
            survival: {
                value: 0,
                specializations: [],
            },
            weaponry: {
                value: 0,
                specializations: [],
            },
            academics: {
                value: 0,
                specializations: [],
            },
            computer: {
                value: 0,
                specializations: [],
            },
            crafts: {
                value: 0,
                specializations: [],
            },
            investigation: {
                value: 0,
                specializations: [],
            },
            medicine: {
                value: 0,
                specializations: [],
            },
            occult: {
                value: 0,
                specializations: [],
            },
            politics: {
                value: 0,
                specializations: [],
            },
            science: {
                value: 0,
                specializations: [],
            },
            'animal ken': {
                value: 0,
                specializations: [],
            },
            empathy: {
                value: 0,
                specializations: [],
            },
            expression: {
                value: 0,
                specializations: [],
            },
            intimidation: {
                value: 0,
                specializations: [],
            },
            persuasion: {
                value: 0,
                specializations: [],
            },
            socialize: {
                value: 0,
                specializations: [],
            },
            streetwise: {
                value: 0,
                specializations: [],
            },
            subterfuge: {
                value: 0,
                specializations: [],
            },
        },
        mana: {
            current: getManaLimit(1),
            max: getManaLimit(1),
        },
        size: 5,
        armor: 0,
        beats: 0,
        experience: 0,
        health: {
            max: 6,
            current: 6,
        },
        willpower: {
            max: 2,
            current: 2,
        },
        additionalInfo: ``,
    })
