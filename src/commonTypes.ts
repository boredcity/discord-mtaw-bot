export type StringId = string
export type NumberId = number

type Decrement = [never, 0, 1, 2, 3, 4, 5]
export type RepeatString<S extends string, N extends number = 5> = N extends 1
    ? S
    : `${S}${`` | RepeatString<S, Decrement[N]>}`

export type PrimaryFactorChoiceValue = `duration` | `potency`

// export type Character {
//     knownRotes: {
//         description: RoteDescription,

//     }
// }

export type ArcanaName =
    | `death`
    | `life`
    | `forces`
    | `fate`
    | `matter`
    | `mind`
    | `prime`
    | `space`
    | `spirit`
    | `time`

export type ArcanaDescription = {
    arcana: ArcanaName
    level: number
}

export type PracticeName =
    | `compelling`
    | `knowing`
    | `unveiling`
    | `veiling`
    | `ruling`
    | `shielding`
    | `weaving`
    | `fraying`
    | `perfecting`
    | `unraveling`
    | `patterning`
    | `making`
    | `unmaking`

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
