import { Clause, CopyOpts } from "./Clause";

export default class ListClause implements Clause{

    constructor(readonly clauses:Clause[], readonly negated=false){

    }

    concat(other: Clause): Clause {

        // TODO: this breaks the other clause if it is negated!
        // if(!this.negated && !other.negated) ...

        if(this.negated){
            return new ListClause([this.copy(), ...other.toList()])
        }else{
            return new ListClause(this.toList().concat(other.toList()))
        }

    }

    copy(opts?: CopyOpts): ListClause {
        return new ListClause(this.clauses, opts?.negate? !this.negated : this.negated)
    }

    toList(): Clause[] {
        return this.clauses.concat([])
    }

    toString(){
        return this.negated? `not(${this.clauses.toString()})` : this.clauses.toString()
    }
}