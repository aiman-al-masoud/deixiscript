
import { getParser } from "../frontend/parser/interfaces/Parser";
import { evalAst } from "../backend/eval/evalAst";
import Brain from "./Brain";
import { BrainListener } from "./BrainListener";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { getContext } from "../backend/things/Context";
import { Thing } from "../backend/things/Thing";
import { logVerb } from "../backend/things/VerbThing";


export default class BasicBrain implements Brain {

    readonly context = getContext({ id: 'global' })
    protected listeners: BrainListener[] = []

    constructor() {
        this.execute(this.context.getPrelude())
        this.context.set(logVerb.getId(), logVerb)
        this.context.setLexeme({ root: 'log', type: 'verb', referents: [logVerb] })
    }

    execute(natlang: string): Thing[] {

        return natlang.split('.').flatMap(x => {

            return getParser(x, this.context).parseAll().flatMap(ast => {

                let results: Thing[] = []
                try {
                    results = evalAst(this.context, ast as AstNode)
                } catch (e) {
                    console.warn(e)
                }

                this.listeners.forEach(l => {
                    l.onUpdate(ast, results)
                })

                return results

            })

        })
    }

    executeUnwrapped(natlang: string): (object | number | string)[] {
        return this.execute(natlang).map(x => x.toJs())
    }

    addListener(listener: BrainListener): void {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener)
        }
    }

}