// import { getLexer } from "../lexer/Lexer";
// import { LexemeType } from "../ast/interfaces/LexemeType";
import { AstNode, AstType } from "./ast-types";
// import { LexemeType } from "../../ast/interfaces/LexemeType";
import { KoolParser } from "./KoolParser";

export interface Parser {
    parse(): AstNode<AstType> | undefined;
    parseAll(): (AstNode<AstType> | undefined)[]
}

export function getParser(sourceCode: string): Parser {
    return new KoolParser(sourceCode);
}


