import { lexemes } from "./lexemes"
import { lexemeTypes } from "./LexemeType"
import { prelude } from "./prelude"
import { syntaxes, staticDescPrecedence } from "./syntaxes"


export function getConfig() {

    return {
        lexemeTypes,
        lexemes,
        syntaxes,
        prelude,
        staticDescPrecedence,
        // things,
    }
}

