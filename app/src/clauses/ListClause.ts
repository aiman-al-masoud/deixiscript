import { Clause, ConcatOpts, CopyOpts, Id } from "./Clause";

export default class ListClause implements Clause{

    constructor(readonly clauses:Clause[], readonly negated=false){

    }

    concat(other: Clause, opts?:ConcatOpts): Clause {

        // TODO: this op is a little bit clumsy, consider using a simplify() method instead.

        if(opts?.asRheme){
            return new ListClause([this.copy(), other.copy()])
        }

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
        return new ListClause(this.clauses.map(c=>c.copy(opts)), opts?.negate? !this.negated : this.negated)
    }

    toList(): Clause[] {
        return this.clauses.concat([])
    }

    toString(){
        return this.negated? `not(${this.clauses.toString()})` : this.clauses.toString()
    }

    get entities(): Id[] {
        return Array.from(new Set(this.clauses.flatMap(c=>c.entities))  )
    }

    get theme(): Clause {
        return this.clauses[0]
    }

    get rheme(): Clause {
        return this.clauses[1]
    }
}