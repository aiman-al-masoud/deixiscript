import { getContext } from "../backend/Context";
import { Thing } from "../backend/Thing";
import { getParser } from "../frontend/parser/interfaces/Parser";
import { evalAst } from "../middle/evalAst";
import { astToGraphViz } from "../utils/astToEdgeList";
import Brain from "./Brain";


export default class BasicBrain implements Brain {

    readonly context = getContext({ id: 'global' })

    constructor() {
        this.execute(this.context.getPrelude())
    }

    execute(natlang: string): Thing[] {
        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                return []
            }

            console.log(astToGraphViz(ast))
            return evalAst(this.context, ast)
        }).flat()
    }

    executeUnwrapped(natlang: string): object[] {
        return this.execute(natlang).map(x => x.toJs())
    }

}