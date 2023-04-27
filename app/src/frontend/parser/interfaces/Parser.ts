import { Context } from "../../../backend/things/Context"
import { KoolParser } from "../KoolParser"
import { AstNode } from "./AstNode"

export interface Parser {
    parseAll(): AstNode[]
}

export function getParser(sourceCode: string, context: Context): Parser {
    return new KoolParser(sourceCode, context)
}
