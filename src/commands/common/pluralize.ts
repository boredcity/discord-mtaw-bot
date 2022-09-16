export const pluralize = (n: number, single: string, plural: string) =>
    n === 1 ? single : plural

export const pluralizeLabel = (n: number, single: string, plural: string) =>
    `${n} ${pluralize(n, single, plural)}`
