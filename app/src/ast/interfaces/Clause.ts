export interface Clause {
    clauses: string[];
    opts?: ClauseOpts;
    concat(other: Clause): Clause;
    copy(opts: ClauseOpts): Clause;
}

export class BasicClause implements Clause {

    constructor(readonly clauses: string[], readonly opts?: ClauseOpts) {
    }

    concat(other: Clause): Clause {
        return new BasicClause(this.clauses.concat(other.clauses));
    }

    copy(opts: ClauseOpts): Clause {
        return new BasicClause(this.clauses, { ...this.opts, ...opts });
    }

}

export interface ClauseOpts {
    negated: boolean;
}

export function clauseOf(string: string | string[], opts?: ClauseOpts): Clause {
    return new BasicClause(string instanceof Array ? string : [string], opts);
}

export const emptyClause = () => clauseOf([]);

export function makeHornClauses(_conditions: Clause, conclusions: Clause) {

    const conditions = _conditions.clauses.map(s => s)
        .reduce((a, b) => `${a}, ${b}`);

    return conclusions
        .clauses
        .map(p => clauseOf(`${p} :- ${conditions}`)) // one horn clause for every predicate in the conclusion
        .reduce((c1, c2) => c1.concat(c2));
}
