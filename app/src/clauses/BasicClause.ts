import { Clause, CONST_PREFIX, CopyOpts, VAR_PREFIX } from "./Clause";


export class BasicClause implements Clause {

    constructor(readonly clauses: string[]) {

    }

    isImply(): boolean {
        return this.clauses.some(c=>c.includes(':-'))
    }

    copy(opts?: CopyOpts): Clause {

        return this.withVars(opts?.withVars ?? false)
                   .negate(opts?.negate ?? false)

    }

    protected withVars(withVars: boolean) {

        return new BasicClause(withVars ?
            this.clauses.map(c => c.replaceAll(CONST_PREFIX, VAR_PREFIX)) :
            this.clauses.map(c => c.replaceAll(VAR_PREFIX, CONST_PREFIX)))

    }

    protected negate(negate: boolean) {

        return negate ?
            new BasicClause([`not( (${this.clauses.reduce((c1, c2) => `${c1}, ${c2}`)}) )`]) :
            new BasicClause(this.clauses.concat([]))
    }

    concat(other: Clause): Clause {
        return new BasicClause(this.clauses.concat(other.clauses))
    }

}
