import Action from "./Action";
import { makeLexeme } from "../../frontend/lexer/Lexeme";
import { LexemeType } from "../../config/LexemeType";
import { Id } from "../../middle/id/Id";
import { Clause, clauseOf } from "../../middle/clauses/Clause";
import { Context } from "../../facade/context/Context";
import { wrap } from "../wrapper/Wrapper";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";

export default class CreateLexemeAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!context.lexemeTypes.includes(this.clause.predicate?.root as any) && !this.topLevel.rheme.flatList().some(x => x.predicate?.isConcept)) {
            return
        }

        const name = this.topLevel.theme.describe((this.clause.args as any)[0])[0].root //TODO: could be undefined        
        const type = (context.lexemeTypes.includes(this.clause.predicate?.root as any) ? this.clause.predicate?.root : 'adjective') as LexemeType
        const concepts = type === 'noun' ? [] : type === 'adjective' ? [this.clause.predicate?.root].flatMap(x => x ?? []).filter(x => x !== name)/* HEEEEEEEERE */ : undefined
        const res = this.topLevel.query($('proto', 'X')).at(0)?.['X']
        const proto = res ? this.topLevel.describe(res).map(x => x.root).filter(x => x !== 'proto')[0] : undefined


        // if (concepts && concepts[0]) {
        //     console.log(concepts[0])
        //     console.log(context.getLexeme(concepts[0])?.referent)
        // }

        const referent = wrap({ id: getIncrementalId() })
        referent.setProto(proto)
        referent.setConcepts(concepts)

        const lexeme = makeLexeme({
            root: name,
            type,
            referent,
        })

        context.setLexeme(lexeme)

    }

}


const $ = (p: string, ...args: Id[]) => clauseOf(makeLexeme({ root: p, type: 'noun' }), ...args)