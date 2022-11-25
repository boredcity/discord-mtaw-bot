export type PhysicalAttributeName =
    // raw physical strength.
    | `strength`
    // speed and ease of movement, covering both full body movement (i.e. gymnastics) and hand-eye coordination.
    | `dexterity`
    // physical hardiness, including resistance to disease and physical trauma and how fast you can recover.
    | `stamina`
export type SocialAttributeName =
    // how you come across to others socially; how you conduct yourself in public when not actively interacting with others.
    | `charisma`
    // how easily you bend others to your will, either through persuasion or threats.
    | `manipulation`
    // your level of attractiveness; may be raised temporarily with clothing or other adornment.
    | `appearance`
export type MentalAttributeName =
    // memory and raw brain power.
    | `intelligence`
    // your ability to notice things, to perceive the world around you, through all your senses.
    | `perception`
    // quickness of thinking; measures how easily you make leaps of logic or intuition.
    | `wits`

export type AttributeName =
    | PhysicalAttributeName
    | SocialAttributeName
    | MentalAttributeName
