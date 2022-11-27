export type PhysicalAttributeName = `strength` | `dexterity` | `stamina`
export type SocialAttributeName = `presense` | `manipulation` | `composure`
export type MentalAttributeName = `intelligence` | `wits` | `resolve`

export type AttributeName =
    | PhysicalAttributeName
    | SocialAttributeName
    | MentalAttributeName
