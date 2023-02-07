import { LexemeType } from "../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"


export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
    /**for quantadj */ readonly cardinality?: Cardinality
    readonly irregularForms?: string[]
    readonly concepts?: string[]
    readonly proto?: string
}
