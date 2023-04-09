
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { evalAst } from "../middle/evalAst";
import { Id } from "../middle/id/Id";
import { BaseThing } from "./BaseThing";
import { Context } from "./Context";
import { Thing, Verb } from "./Thing";

export class VerbThing extends BaseThing implements Verb {

    constructor(
        readonly id: Id,
        readonly instructions: AstNode[],
    ) {
        super(id)
    }

    run(context: Context, args: { subject: Thing; directObject: Thing; indirectObject: Thing; }): Thing[] {

        const clonedContext = context.clone()
        // inject subject, directObject etc... with making them retrievable via query, problem: harcoded english!
        clonedContext.setLexeme({ root: 'subject', type: 'noun', referents: [args.subject] })
        clonedContext.setLexeme({ root: 'direct-object', type: 'noun', referents: [args.directObject] })
        clonedContext.setLexeme({ root: 'indirect-object', type: 'noun', referents: [args.indirectObject] })

        let results: Thing[] = []

        this.instructions.forEach(ast => {
            results = evalAst(clonedContext, ast)
        })

        return results
    }


}