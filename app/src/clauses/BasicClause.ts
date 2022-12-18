import { Clause, CopyOpts } from "./Clause";


export class BasicClause implements Clause {

    constructor(readonly clauses: string[]) {

    }

    copy(opts?: CopyOpts): Clause {

        if (opts?.negate) {
            return new BasicClause([`not( (${this.clauses.reduce((c1, c2) => `${c1}, ${c2}`)}) )`])
        } else {
            return new BasicClause(this.clauses.concat([]))
        }

    }

    concat(other: Clause): Clause {
        return new BasicClause(this.clauses.concat(other.clauses))
    }

}
