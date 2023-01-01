import { getRandomId, Id } from "../clauses/Id";
import { PrologClause, CopyPrologClauseOpts } from "./PrologClause";
import { AndPrologClause } from "./AndPrologClause";


export class BasicPrologClause implements PrologClause {

    constructor(readonly predicate: string, readonly args: Id[], readonly negated: boolean, readonly anyFact = false) {
    }

    toString(): string {
        return `${this.args.length === 1 ? 'be' : 'rel'}(${this.anyFact ? '_' : getRandomId()}, ${this.args.reduce((a, b) => a + ', ' + b)}, ${this.predicate}, ${!this.negated})`;
    }

    copy(opts?: CopyPrologClauseOpts): PrologClause {
        return new BasicPrologClause(this.predicate, this.args, this.negated, opts?.anyFact ?? this.anyFact);
    }

    and(clause: PrologClause): PrologClause {
        return new AndPrologClause([this, ...clause.toList()]);
    }

    toList(): PrologClause[] {
        return [this];
    }
}
