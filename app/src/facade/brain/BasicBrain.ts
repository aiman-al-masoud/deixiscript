import Thing from "../../backend/wrapper/Thing";
import { getParser } from "../../frontend/parser/interfaces/Parser";
import { evalAst2 } from "../../middle/evalAst2";
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

            return evalAst2(this.context, ast)

        }).flat()
    }

    executeUnwrapped(natlang: string): any[] {
        return this.execute(natlang).map(x => x?.unwrap?.() ?? x)
    }

}