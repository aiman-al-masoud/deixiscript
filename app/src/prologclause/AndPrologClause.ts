import { PrologClause, CopyPrologClauseOpts } from "./PrologClause";


export class AndPrologClause implements PrologClause {

    constructor(readonly clauses: PrologClause[]) {
    }

    toString(): string {
        return this.clauses.map(c => c.toString())
            .reduce((a, b) => a + ', ' + b);
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new AndPrologClause(this.clauses.map(c => c.copy(opts)));
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([...this.toList(), ...clause.toList()]);
    }

    toList(): PrologClause[] {
        return this.clauses.flatMap(c => c.toList());
    }

}
