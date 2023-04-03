import { lexemes } from "../../config/lexemes"
import { LexemeType, lexemeTypes } from "../../config/LexemeType"
import { prelude } from "../../config/prelude"
import { CompositeType, syntaxes, staticDescPrecedence } from "../../config/syntaxes"
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme"
import { SyntaxMap } from "../../frontend/parser/interfaces/Syntax"


export interface Config {
    readonly lexemeTypes: LexemeType[]
    readonly lexemes: Lexeme[]
    readonly syntaxes: SyntaxMap
    readonly prelude: string[]
    readonly staticDescPrecedence: CompositeType[]
}

export function getConfig(): Config {

    return {
        lexemeTypes,
        lexemes: lexemes.flatMap(x => {
            const l = makeLexeme(x)
            return [l, ...l.extrapolate()]
        }),
        syntaxes,
        prelude,
        staticDescPrecedence,
    }
}

