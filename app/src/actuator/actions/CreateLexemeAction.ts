import Action from "./Action";
import { Context } from "../../brain/Context";
import { Clause, clauseOf } from "../../clauses/Clause";
import { makeLexeme } from "../../lexer/Lexeme";
import { LexemeType } from "../../config/LexemeType";
import { Id } from "../../id/Id";

export default class CreateLexemeAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!context.config.lexemeTypes.includes(this.clause.predicate?.root as any) && !this.topLevel.rheme.flatList().some(x => x.predicate?.isConcept)) {
            return
        }

        const name = this.topLevel.theme.describe((this.clause.args as any)[0])[0].root //TODO: could be undefined        
        const type = (context.config.lexemeTypes.includes(this.clause.predicate?.root as any) ? this.clause.predicate?.root : 'adjective') as LexemeType
        const concepts = type === 'noun' ? [] : type === 'adjective' ? [this.clause.predicate?.root].flatMap(x => x ?? []).filter(x => x !== name)/* HEEEEEEEERE */ : undefined
        const res = this.topLevel.query($('proto', 'X')).at(0)?.['X']
        const proto = res ? this.topLevel.describe(res).map(x => x.root).filter(x => x !== 'proto')[0] : undefined



        const lexeme = makeLexeme({
            root: name,
            type: type,
            proto: proto,
            concepts: concepts
        })

        context.config.setLexeme(lexeme)

    }

}


const $ = (p: string, ...args: Id[]) => clauseOf(makeLexeme({ root: p, type: 'noun' }), ...args)