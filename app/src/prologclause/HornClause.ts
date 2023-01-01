import { PrologClause, CopyPrologClauseOpts } from "./PrologClause";
import { AndPrologClause } from "./AndPrologClause";

export class HornClause implements PrologClause {

    constructor(readonly conclusion: PrologClause, readonly conditions: PrologClause, readonly anyFact = false) {
        
    }

    toString(): string {

        const conditions = this.conditions
            .toList()
            .map(c => c.copy({ anyFact: true }))
            .map(c => c.toString())
            .reduce((a, b) => a + ', ' + b);

        const conclusion = this.conclusion.copy({ anyFact: true }).toString();

        return `${conclusion} :- ${conditions}`;
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new HornClause(this.conclusion, this.conditions);
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([this, ...clause.toList()]);
    }

    toList(): PrologClause[] {
        return [this];
    }

}
