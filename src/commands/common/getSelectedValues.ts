export type SelectedValue<T extends string = string> = {
    value: T
    label: string
}

// TODO: store all options as objects
export const getSelectedValues = <T extends string, X extends SelectedValue<T>>(
    allOptions: X[],
    selectedValueNames: T[],
): X[] => {
    const completeValues = allOptions as X[]
    completeValues.reduce((acc, v) => {
        acc[v.value] = v
        return acc
    }, {} as Partial<Record<T, SelectedValue<T>>>)
    return selectedValueNames.map((selected) => {
        const found = completeValues.find((v) => v.value === selected)
        if (found === undefined) {
            throw Error(`could not find ${selected} in completeValues`)
        }
        return found
    })
}
