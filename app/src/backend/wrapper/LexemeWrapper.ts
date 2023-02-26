// import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme";
// import { Clause, emptyClause } from "../../middle/clauses/Clause";
// import { Id } from "../../middle/id/Id";
// import BaseWrapper from "./BaseWrapper";

// export default class LexemeWrapper extends BaseWrapper {


//     constructor(readonly object: Lexeme, id: Id) {
//         super(object, id, false)

//     }

//     override clause(query?: Clause): Clause {


//         if (query?.flatList().map(x => x.predicate).some(x => x?.root === this.object.root   && !this.object.token)) {
//             this.simplePredicates.push(this.object)
//             return super.clause(query)
//         }

//         return emptyClause
//     }


// }