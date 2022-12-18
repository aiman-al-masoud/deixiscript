import { BasicClause } from "./BasicClause"

export const CONST_PREFIX = 'id'
export const VAR_PREFIX = 'Id'
export type Id = number | string


export interface Clause {
    clauses: string[]
    concat(other: Clause): Clause
    copy(opts:CopyOpts):Clause
    isImply():boolean
}

export function clauseOf(string: string | string[]): Clause {
    return new BasicClause(string instanceof Array ? string : [string])
}

export interface CopyOpts{
    negate? : boolean,
    withVars? : boolean
}

export const emptyClause = () => clauseOf([])

export function makeHornClauses(_conditions: Clause, conclusions: Clause) {

    const conditions = _conditions.clauses.map(s => s)
        .reduce((a, b) => `${a}, ${b}`);

    return conclusions
        .clauses
        .map(p => clauseOf(`${p} :- ${conditions}`)) // one horn clause for every predicate in the conclusion
        .reduce((c1, c2) => c1.concat(c2));
}

export function getRandomId(): Id {
    return `${CONST_PREFIX}${parseInt(1000000 * Math.random()+'')}`
}