import { Config } from "../../config/Config"
import { KoolParser } from "../KoolParser"
import { AstNode } from "./AstNode"
import { AstType } from "./Syntax"

export interface Parser {
    parse(): AstNode<AstType> | undefined
    parseAll(): (AstNode<AstType> | undefined)[]
}

export function getParser(sourceCode: string, config: Config): Parser {
    return new KoolParser(sourceCode, config)
}


