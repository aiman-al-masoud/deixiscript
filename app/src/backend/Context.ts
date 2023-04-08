
import { LexemeType } from "../config/LexemeType";
import { CompositeType } from "../config/syntaxes";
import { Lexeme } from "../frontend/lexer/Lexeme";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { AstType, Syntax } from "../frontend/parser/interfaces/Syntax";
import { Id } from "../middle/id/Id";
import { BasicContext } from "./BasicContext";
import { Thing } from "./Thing";

export interface Context extends Thing {

    getSyntax(name: AstType): Syntax
    setSyntax(macro: AstNode): void
    setLexeme(lexeme: Lexeme): void
    getLexeme(rootOrToken: string): Lexeme | undefined

    readonly lexemes: Lexeme[]
    readonly prelude: string[]
    readonly syntaxList: CompositeType[]
    readonly lexemeTypes: LexemeType[]
}

export function getContext(opts: { id: Id }): Context {
    return new BasicContext(opts.id)
}