import Action from "./Action";
import { Context } from "../../brain/Context";
import { Clause, clauseOf } from "../../clauses/Clause";
import { Lexeme } from "../../lexer/Lexeme";
import { LexemeType } from "../../config/LexemeType";
import { Id } from "../../id/Id";

export default class CreateLexemeAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!context.config.lexemeTypes.includes(this.clause.predicate?.root as any)) {
            return
        }

        const name = this.topLevel.describe(this.clause.entities[0])[0].root //TODO: could be undefined
        
        const res = this.topLevel.query($('proto', 'X')).at(0)?.['X']
        // this.topLevel.describe()
        const proto = res ? this.topLevel.describe(res).map(x => x.root).filter(x => x !== 'proto')[0] : undefined

        const lexeme: Lexeme = {
            root: name,
            type: this.clause.predicate?.root as LexemeType,
            proto: proto
        }

        // console.log(this.topLevel.toString())
        // console.log(lexeme)
        context.config.setLexeme(lexeme)


    }

}


const $ = (p: string, ...args: Id[]) => clauseOf({ root: p, type: 'noun' }, ...args)