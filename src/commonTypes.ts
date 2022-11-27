export type StringId = string
export type NumberId = number

type Decrement = [never, 0, 1, 2, 3, 4, 5]
export type RepeatString<
    S extends string,
    N extends number = numberFrom1to5,
> = N extends 1 ? S : `${S}${`` | RepeatString<S, Decrement[N]>}`

export type numberFrom1to5 = 1 | 2 | 3 | 4 | 5
export type numberFrom1to10 = numberFrom1to5 | 6 | 7 | 8 | 9 | 10
export type numberFrom0to5 = 0 | numberFrom1to5

export abstract class Serializable {
    abstract id: StringId
    static fromJSON: (json: object) => Serializable
    abstract toJSON(): object
    toString() {
        return this.toJSON()
    }
}
