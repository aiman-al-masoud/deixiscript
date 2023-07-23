export type SyntaxMap<R extends string = string, T extends string = string>
    = { [x in T]: Syntax<R, T> }

export type Syntax<R = string, T = string>
    = Member<R, T>[]

export type Member<R = string, T = string>
    = LiteralMember<R, T> | TypeMember<R, T>

type BaseMember<R = string, T = string> = {
    /** default is exactly once*/readonly number?: Cardinality
    /** default means excluded from AST */readonly role?: R
    /** separator */readonly sep?: T
    /** expand child into parent, if 'keep-specific-type' then parent is replaced by child */readonly expand?: boolean | 'keep-specific-type'
    /** reduce char list to string, or to number  */readonly reduce?: boolean | 'to-number'
    /** default replacement for missing member AST */ readonly defaultsTo?: AstNode
    readonly notEndWith?: string
    readonly types?: T[]

    readonly wrap?: { role: R, of: T }
    readonly replaceWith?: AstNode
}

export type LiteralMember<R = string, T = string> = BaseMember<R, T> & {
    readonly literals: string[]
    readonly anyCharExceptFor?: string[]
    /** takes the string literal corresponding to bool true */ readonly isBool?: string
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
    | boolean
    | string[]
    | AstNode[]
    | { [x: string]: AstNode } & { type?: string, wrap?: BaseMember['wrap'] }


