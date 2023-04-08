import { Context } from "../../facade/context/Context";
import { AstNode } from "../../frontend/parser/interfaces/AstNode";
import { evalAst } from "../../middle/evalAst";
import { Id } from "../../middle/id/Id";
import { BaseThing } from "./BaseThing";
import { Thing, Verb } from "./Thing";

export class VerbThing extends BaseThing implements Verb {

    constructor(
        readonly id: Id,
        readonly instructions: AstNode[],
    ) {
        super(id)
    }

    run(context: Context, args: { subject: Thing; directObject: Thing; indirectObject: Thing; }): Thing[] {
        // clone context!
        const clonedContext = {} as Context
        // inject subject, directObject etc... with making them retrievable via query, problem: harcoded english!
        clonedContext.setLexeme({ root: 'subject', type: 'noun', referent: args.subject })
        clonedContext.setLexeme({ root: 'direct-object', type: 'noun', referent: args.directObject })
        clonedContext.setLexeme({ root: 'indirect-object', type: 'noun', referent: args.indirectObject })

        let results: Thing[] = []

        this.instructions.forEach(ast => {
            results = evalAst(clonedContext, ast)
        })

        // return results
        throw new Error("Method not implemented.");
    }


}