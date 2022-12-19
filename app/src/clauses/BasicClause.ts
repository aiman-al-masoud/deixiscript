import { Clause, CONST_PREFIX, CopyOpts, Id, VAR_PREFIX } from "./Clause";
import ListClause from "./ListClause";


export class BasicClause implements Clause{

    constructor(readonly predicate:string, readonly args:Id[], readonly negated=false){

    }

    concat(other: Clause): Clause {
        return new ListClause(this.toList().concat(other.toList()))
    }

    copy(opts?: CopyOpts): BasicClause {
        return new BasicClause(this.predicate, this.args.concat([]), opts?.negate? !this.negated : this.negated)
    }

    toList(): Clause[] {
        return [this.copy()]
    }

    toString(){
        const core = `${this.predicate}(${this.args.reduce((a1,a2)=>a1+', '+a2)})`
        return this.negated? `not(${core})` : core
    }

    get entities(): Id[] {
        return Array.from(new Set(this.args.concat([])))
    }
}

// export class BasicClause implements Clause {

//     constructor(readonly clauses: string[]) {

//     }

//     isImply(): boolean {
//         return this.clauses.some(c=>c.includes(':-'))
//     }

//     copy(opts?: CopyOpts): Clause {

//         return this.withVars(opts?.withVars ?? false)
//                    .negate(opts?.negate ?? false)

//     }

//     protected withVars(withVars: boolean) {

//         return new BasicClause(withVars ?
//             this.clauses.map(c => c.replaceAll(CONST_PREFIX, VAR_PREFIX)) :
//             this.clauses.map(c => c.replaceAll(VAR_PREFIX, CONST_PREFIX)))

//     }

//     protected negate(negate: boolean) {

//         return negate ?
//             new BasicClause([`not( (${this.clauses.reduce((c1, c2) => `${c1}, ${c2}`)}) )`]) :
//             new BasicClause(this.clauses.concat([]))
//     }

//     concat(other: Clause): Clause {
//         return new BasicClause(this.clauses.concat(other.clauses))
//     }

// }
