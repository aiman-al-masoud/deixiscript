// import { Clause, CopyOpts } from "./Clause";
// import ListClause from "./ListClause";

// export default class AnaClause implements Clause{

//     constructor(readonly theme:Clause, readonly rheme:Clause, readonly negated=false){

//     }
    
//     addRheme(other: Clause): Clause {
//         throw new Error("Method not implemented.");
//     }

//     concat(other: Clause): Clause {
//         throw new Error("Method not implemented.");
//     }
    
//     copy(opts?: CopyOpts): Clause {
//         return new AnaClause(this.theme.copy(), this.rheme.copy())
//     }

//     toList(): Clause[] {// BAAAADD?
//         return [this.theme.copy(), this.rheme.copy()] 
//     }

// }