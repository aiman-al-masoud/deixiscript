import { getContext } from "../backend/Context";
import { Thing } from "../backend/Thing";
import { plotAst } from "../draw-ast/plotAst";
import { getParser } from "../frontend/parser/interfaces/Parser";
import { evalAst } from "../middle/evalAst";
import Brain from "./Brain";


export default class BasicBrain implements Brain {

    readonly context = getContext({ id: 'global' })

    constructor(readonly args?: { canvasContext?: CanvasRenderingContext2D | null }) {
        this.execute(this.context.getPrelude())
    }

    execute(natlang: string): Thing[] {
        return getParser(natlang, this.context).parseAll().flatMap(ast => {

            if (ast.type === 'macro') {
                return []
            }

            if (this.args?.canvasContext) {
                plotAst(this.args?.canvasContext, ast)
            }

            return evalAst(this.context, ast)
        })
    }

    executeUnwrapped(natlang: string): object[] {
        return this.execute(natlang).map(x => x.toJs())
    }

}