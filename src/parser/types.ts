export type SyntaxMap<R extends string = string, T extends string = string>
    = { [x in T]: Syntax<R, T> }

export type Syntax<R = string, T = string>
    = Member<R, T>[]

export type Member<R = string, T = string>
    = LiteralMember<R, T> | TypeMember<R, T>

type BaseMember<R = string, T = string> = {
    readonly number?: Cardinality // no number = 1
    readonly role?: R // no role = exclude from ast
    readonly sep?: T // separator
    readonly expand?: boolean | 'keep-specific-type' // expand child into parent
    readonly reduce?: boolean | 'to-number' // list of chars to string
    readonly notEndWith?: string
    readonly types?: T[]
}

export type LiteralMember<R = string, T = string> = BaseMember<R, T> & {
    readonly literals: string[]
    readonly anyCharExceptFor?: string[]
}

export type TypeMember<R = string, T = string> = BaseMember<R, T> & {
    readonly types: T[]
    readonly literals?: undefined
}

export type Cardinality = '*' // zero or more
    | '1|0' // one or zero
    | '+' // one or more
    | 'all-but-last'
    | number // currently only supports =1

export const isNecessary = (c?: Cardinality) =>
    c === undefined // necessary by default
    || c == '+'
    || +c >= 1

export const isRepeatable = (c?: Cardinality) =>
    c == '+'
    || c == '*'
    || c === 'all-but-last'

export type AstNode =
    string
    | number
    | string[]
    | AstNode[]
    | { [x: string]: AstNode } & { type?: string }


