import { getRandomId, Id } from "./Id"

export interface PrologClause {
    toString(): string
    copy(opts?: CopyPrologClauseOpts): PrologClause
}

export interface CopyPrologClauseOpts {
    anyFact: boolean
}

export class BasicPrologClause implements PrologClause {

    constructor(readonly predicate: string, readonly args: (string | Id | boolean)[], readonly anyFact = false) {

    }

    toString(): string {
        return `${this.predicate}(${this.anyFact ? '_' : getRandomId()}, ${this.args.reduce((a, b) => a + ', ' + b)})`
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new BasicPrologClause(this.predicate, this.args, opts?.anyFact ?? this.anyFact)
    }

}

export class HornClause implements PrologClause {

    constructor(readonly conclusion: BasicPrologClause, readonly conditions: BasicPrologClause[], readonly anyFact = false) {

    }

    toString(): string {

        const conditions = this.conditions.map(c => c.copy({ anyFact: true }))
            .map(c => c.toString())
            .reduce((a, b) => a + ', ' + b)

        const conclusion = this.conclusion.copy({ anyFact: true }).toString()

        return `${conclusion} :- ${conditions}`
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new HornClause(this.conclusion, this.conditions)
    }

}