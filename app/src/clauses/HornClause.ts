import { BasicClause } from "./BasicClause";
import { Clause, ConcatOpts, CopyOpts, Id } from "./Clause";
import ListClause from "./ListClause";

export class HornClause implements Clause{

    constructor(readonly condition:BasicClause[], readonly conclusion:BasicClause, readonly negated=false){

    }

    concat(other: Clause, opts?:ConcatOpts): Clause {
        return new ListClause(this.toList().concat(other.toList()))
    }

    copy(opts?: CopyOpts): HornClause {
        return new HornClause(this.condition.map(c=>c.copy(opts)), this.conclusion.copy(opts))
    }

    toList(): Clause[] {
        return [this.copy()]
    }

    toString(){
        return `${this.conclusion.toString()} :- ${this.condition.map(c=>c.toString()).reduce((c1,c2)=>c1+', '+c2)}`
    }

    get entities(): Id[] {
        return Array.from(new Set(this.condition.flatMap(c=>c.entities).concat(this.conclusion.entities)))
    }

    get theme(): Clause {
        return this.condition.flatMap(c=>c.theme).reduce((c1, c2)=>c2.concat(c2))
    }
    
    get rheme(): Clause {
        return this.copy() // dunno what I'm doin'
    }

    about(id: Id): Clause[] {
        return this.conclusion.about(id).concat(this.condition.flatMap(c=>c.about(id)))
    }
}