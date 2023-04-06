import Thing from "../../backend/thing/Thing";
import { getParser } from "../../frontend/parser/interfaces/Parser";
import { evalAst } from "../../middle/evalAst";
import { Context } from "../context/Context";
import Brain from "./Brain";


export default class BasicBrain implements Brain {

    constructor(
        readonly context: Context,
    ) {
        this.context.prelude.forEach(c => this.execute(c))
    }

    execute(natlang: string): Thing[] {
        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                this.context.setSyntax(ast)
                return []
            }

            const res = evalAst(this.context, ast)
            this.context.values.forEach(x => x.pointOut(false))
            res.forEach(x => x.pointOut(true))
            return res

        }).flat()
    }

    executeUnwrapped(natlang: string): any[] {
        return this.execute(natlang).map(x => x?.unwrap?.() ?? x)
    }

}