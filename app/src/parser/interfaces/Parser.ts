import { Config } from "../../config/Config"
import { KoolParser } from "../KoolParser"
import { AstNode } from "./AstNode"

export interface Parser {
    parseAll(): AstNode[]
}

export function getParser(sourceCode: string, config: Config): Parser {
    return new KoolParser(sourceCode, config)
}
