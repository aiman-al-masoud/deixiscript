
import { evalAst } from "../middle/evalAst";
import { Id } from "../middle/id/Id";
import { BaseThing } from "./BaseThing";
import { Context } from "./Context";
import { InstructionThing } from "./InstructionThing";
import { Thing } from "./Thing";

export interface Verb extends Thing {
    run(context: Context, args: { [role in VerbArgs]: Thing }): Thing[] // called directly in evalVerbSentence()
}

type VerbArgs = 'subject' //TODO
    | 'object'

export class VerbThing extends BaseThing implements Verb {

    constructor(
        readonly id: Id,
        readonly instructions: InstructionThing[], //or InstructionThing?
    ) {
        super(id)
    }

    run(context: Context, args: { subject: Thing, object: Thing, }): Thing[] {

        const clonedContext = context.clone()
        // inject subject, directObject etc... with making them retrievable via query, problem: harcoded english!
        clonedContext.setLexeme({ root: 'subject', type: 'noun', referents: [args.subject] })
        clonedContext.setLexeme({ root: 'object', type: 'noun', referents: [args.object] })
        // clonedContext.setLexeme({ root: 'indirect-object', type: 'noun', referents: [args.indirectObject] })

        let results: Thing[] = []

        this.instructions.forEach(istruction => {
            results = evalAst(clonedContext, istruction.value)
        })

        return results
    }

}


// x is "ciao"
// y is "mondo"
// you log x and y
// you log "capra!"
// stupidize is the previous "2" instructions
// you stupidize
export const logVerb = new (class extends VerbThing { //TODO: take location complement, either console or "stdout" !
    run(context: Context, args: { subject: Thing; object: Thing; }): Thing[] {
        console.log(args.object.toJs())
        return []
    }
})('log', [])


