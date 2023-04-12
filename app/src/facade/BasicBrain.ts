import { getContext } from "../backend/Context";
import { Thing } from "../backend/Thing";
import { getParser } from "../frontend/parser/interfaces/Parser";
import { evalAst } from "../middle/evalAst";
import Brain from "./Brain";
import { BrainListener } from "./BrainListener";


export default class BasicBrain implements Brain {

    readonly context = getContext({ id: 'global' })
    protected listeners: BrainListener[] = []

    constructor() {
        this.execute(this.context.getPrelude())
    }

    execute(natlang: string): Thing[] {
        return getParser(natlang, this.context).parseAll().flatMap(ast => {

            if (ast.type === 'macro') {
                return []
            }

            let results: Thing[] = []
            try {
                results = evalAst(this.context, ast)
            } catch {
            }

            this.listeners.forEach(l => {
                l.onUpdate(ast, results)
            })

            return results
        })
    }

    executeUnwrapped(natlang: string): object[] {
        return this.execute(natlang).map(x => x.toJs())
    }

    addListener(listener: BrainListener): void {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener)
        }
    }

}