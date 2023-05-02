import { LexemeType } from "../../config/LexemeType";
import { CompositeType } from "../../config/syntaxes";
import { AstType, Syntax } from "../../frontend/parser/interfaces/Syntax";
import { Id } from "../../middle/id/Id";
import { BasicContext } from "./BasicContext";
import { Thing } from "./Thing";

export interface Context extends Thing {
    getSyntax(name: AstType): Syntax
    setSyntax(name: string, syntax: Syntax): void
    getSyntaxList(): CompositeType[]
    getLexemeTypes(): LexemeType[]
    getPrelude(): string
    clone(): Context
}

export function getContext(opts: { id: Id }): Context {
    return new BasicContext(opts.id)
}