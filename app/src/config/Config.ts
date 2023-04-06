import { lexemes } from "./lexemes"
import { lexemeTypes } from "./LexemeType"
import { prelude } from "./prelude"
import { syntaxes, staticDescPrecedence } from "./syntaxes"
import { makeLexeme } from "../frontend/lexer/Lexeme"
import { things } from "./things"


export function getConfig() {

    return {
        lexemeTypes,
        lexemes: lexemes.flatMap(x => {
            const l = makeLexeme(x)
            return [l, ...l.extrapolate()]
        }),
        syntaxes,
        prelude,
        staticDescPrecedence,
        things,
    }
}

