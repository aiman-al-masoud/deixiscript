export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | number // currently only supports =1

export const isNecessary = (c?: Cardinality) => c === undefined // necessary by default
    || c == '+'
    || +c >= 1

export const isRepeatable = (c?: Cardinality) => c == '+'
    || c == '*'
