import { BasicClause } from "./BasicClause"
import { HornClause } from "./HornClause"
import ListClause from "./ListClause"

export const CONST_PREFIX = 'id'
export const VAR_PREFIX = 'Id'
export type Id = number | string


export interface Clause {
    concat(other: Clause): Clause
    copy(opts?:CopyOpts):Clause
    toList():Clause[]
    // addRheme(rheme:Clause):Clause
    readonly negated:boolean
}

export function clauseOf(predicate:string, ...args:Id[]){
    return new BasicClause(predicate, args)
}

export const emptyClause = ():Clause => new ListClause([])

export interface CopyOpts{
    negate? : boolean
    withVars? : boolean
}

export function makeHornClauses(conditions: Clause, conclusions: Clause):Clause {

    // TODO: this breaks negated ListClauses or ListClauses with negated elements !!!!!!!

    const cond = conditions.toList().map(c=> (c as BasicClause))
    const conc = conclusions.toList().map(c=> (c as BasicClause))
    const results = conc.map(c => new HornClause(cond, c))

    return results.length==1 ? results[0] : new ListClause(results)

}

export function getRandomId(): Id {
    return `${CONST_PREFIX}${parseInt(1000000 * Math.random()+'')}`
}