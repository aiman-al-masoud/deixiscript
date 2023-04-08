import { Context } from "../backend/Context";
import { Thing } from "../backend/Thing";
import { getParser } from "../frontend/parser/interfaces/Parser";
import { evalAst } from "../middle/evalAst";
import Brain from "./Brain";


export default class BasicBrain implements Brain {

    constructor(
        readonly context: Context,
    ) {
        this.context.getPrelude().forEach(c => this.execute(c))
    }

    execute(natlang: string): Thing[] {
        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                this.context.setSyntax(ast)
                return []
            }

            const res = evalAst(this.context, ast)
            // this.context.values.forEach(x => x.pointOut(false))
            // res.forEach(x => x.pointOut(true))
            return res

        }).flat()
    }

    executeUnwrapped(natlang: string): object[] {
        return this.execute(natlang).map(x => x?.toJs?.() ?? x)
    }

}