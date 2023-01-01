import Prolog from "../prolog/Prolog"
import { getRandomId, Id } from "./Id"

export interface PrologClause {
    toString(): string
    copy(opts?: CopyPrologClauseOpts): PrologClause
    and(clause: PrologClause): PrologClause
    toList(): PrologClause[]
}

export interface CopyPrologClauseOpts {
    anyFact: boolean
}

export class BasicPrologClause implements PrologClause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated: boolean, readonly anyFact = false) {

    }

    toString(): string {
        return `${this.args.length === 1 ? 'be' : 'rel'}(${this.anyFact ? '_' : getRandomId()}, ${this.args.reduce((a, b) => a + ', ' + b)}, ${this.predicate}, ${!this.negated})`
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new BasicPrologClause(this.predicate, this.args, this.negated, opts?.anyFact ?? this.anyFact)
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([this, ...clause.toList()])
    }

    toList(): PrologClause[] {
        return [this]
    }
}

export class HornClause implements PrologClause {

    constructor(readonly conclusion: BasicPrologClause, readonly conditions: PrologClause, readonly anyFact = false) {

    }

    toString(): string {

        const conditions = this.conditions
            .toList()
            .map(c => c.copy({ anyFact: true }))
            .map(c => c.toString())
            .reduce((a, b) => a + ', ' + b)

        const conclusion = this.conclusion.copy({ anyFact: true }).toString()

        return `${conclusion} :- ${conditions}`
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new HornClause(this.conclusion, this.conditions)
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([this, ...clause.toList()])
    }

    toList(): PrologClause[] {
        return [this]
    }

}

export class AndPrologClause implements PrologClause {

    constructor(readonly clauses: PrologClause[]) {

    }

    toString(): string {
        return this.clauses.map(c => c.toString())
            .reduce((a, b) => a + ', ' + b)
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new AndPrologClause(this.clauses.map(c => c.copy(opts)))
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([...this.toList(), ...clause.toList()])
    }

    toList(): PrologClause[] {
        return this.clauses.flatMap(c=>c.toList())
    }

}

export const emptyPrologClause = ()=> new AndPrologClause([])