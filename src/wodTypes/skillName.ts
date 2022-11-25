// Skills often represent personal experience and training.
export type PhysicalSkillName =
    // sports and movement
    | `athletics`
    // unarmed combat
    | `brawl`
    // operating automobiles under rough conditions
    | `drive`
    // identifying, using, and maintaining shooting weapons.
    | `firearms`
    // picking locks, burglary, bypassing security, sleight of hand, etc
    | `larceny`
    // moving silently and unnoticed
    | `stealth`
    // enduring harsh environments
    | `survival`
    // identifying, using, and maintaining non-firearm weapons
    | `weaponry`

// Mental Skills often represent knowledge from formal education.
export type MentalSkillName =
    // knowledge in Arts and Humanities
    | `academics`
    // computer programs and operating systems
    | `computer`
    // constructing, crafting, and repairing objects
    | `crafts`
    // solving riddles and finding evidence
    | `investigation`
    // physiology, anatomy, and medical treatments
    | `medicine`
    // lore about the supernatural
    | `occult`
    // political processes and bureaucratic maneuvers
    | `politics`
    // physical and natural sciences
    | `science`

// Social Skills often represent practiced and honed natural knack.
export type SocialSkillName =
    // understanding animal minds and behaviors
    | `animal ken`
    // observing emotions and understanding viewpoints
    | `empathy`
    // art of communication and entertainment
    | `expression`
    // coercing via force and threat
    | `intimidation`
    // convincing others and inspiring their emotions
    | `persuasion`
    // social interaction in various situations
    | `socialize`
    // navigating urban streets and gathering intel there
    | `streetwise`
    // deceiving others and noticing it
    | `subterfuge`

export type SkillName = PhysicalSkillName | MentalSkillName | SocialSkillName
