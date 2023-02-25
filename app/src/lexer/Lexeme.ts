import { LexemeType } from "../config/LexemeType"
import { Cardinality } from "../parser/interfaces/Cardinality"


export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
    /**for quantadj */ readonly cardinality?: Cardinality
    readonly proto?: string
    readonly concepts?: string[]
    /*irregular plurals*/ readonly plurals?: string[]
    /*irregular singulars*/ readonly singulars?: string[]
}
