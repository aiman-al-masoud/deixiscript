import { Config } from "../config/Config"
import { AstNode, AstType } from "./ast-types"
import { KoolParser } from "./KoolParser"

export interface Parser {
    parse(): AstNode<AstType> | undefined
    parseAll(): (AstNode<AstType> | undefined)[]
}

export function getParser(sourceCode: string, config: Config): Parser {
    return new KoolParser(sourceCode, config)
}


