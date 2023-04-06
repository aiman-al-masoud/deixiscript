import getEnviro, { Enviro, GetEnviroOps } from "../../backend/enviro/Enviro";
import { LexemeType } from "../../config/LexemeType";
import { CompositeType } from "../../config/syntaxes";
import { Lexeme } from "../../frontend/lexer/Lexeme";
import { AstNode } from "../../frontend/parser/interfaces/AstNode";
import { AstType, Syntax } from "../../frontend/parser/interfaces/Syntax";
import BasicContext from "./BasicContext";

export interface Context extends Enviro {

    getSyntax(name: AstType): Syntax
    setSyntax(macro: AstNode): void
    setLexeme(lexeme: Lexeme): void
    getLexeme(rootOrToken: string): Lexeme | undefined

    readonly lexemes: Lexeme[]
    readonly prelude: string[]
    readonly syntaxList: CompositeType[]
    readonly lexemeTypes: LexemeType[]
}

export interface GetContextOpts extends GetEnviroOps { }

export function getContext(opts: GetContextOpts): Context {
    return new BasicContext(getEnviro(opts))
}