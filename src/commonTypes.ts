export type StringId = string
export type NumberId = number

export type PrimaryFactorChoiceValue = `duration` | `potency`

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

export type RoteDescription = ArcanaDescription & {
    id: string
    name: string
    practice: string
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
