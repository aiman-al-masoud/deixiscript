import { Clause, CopyOpts } from "./Clause";

export default class ListClause implements Clause{

    constructor(readonly clauses:Clause[], readonly negated=false){

    }

    concat(other: Clause): Clause {

        // TODO: this op is a little bit clumsy, consider using a simplify() method instead.

        if(this.negated && other.negated){
            return new ListClause([this.copy(), other.copy()])
        }else if (this.negated){
            return new ListClause([this.copy(), ...other.toList()])
        }else if (other.negated){
            return new ListClause([...this.toList(), other.copy()])
        }else{
            return new ListClause([...this.toList(), ...other.toList()])
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