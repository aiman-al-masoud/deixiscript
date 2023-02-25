import { LexemeType, lexemeTypes } from "../config/LexemeType"
import Wrapper from "../enviro/Wrapper"
import { Cardinality, isRepeatable } from "../parser/interfaces/Cardinality"


export interface Lexeme {
    /**canonical form*/ readonly root: string
    /**token type*/ readonly type: LexemeType
    /**made up of more lexemes*/ readonly contractionFor?: string[]
    /**form of this instance*/readonly token?: string
    /**for quantadj */ readonly cardinality?: Cardinality
    readonly proto?: string
    readonly concepts?: string[]
    readonly _root?: Partial<Lexeme>
    readonly isPlural: boolean
    readonly isConcept: boolean
}

const thisIsRidiculous: (keyof Lexeme)[] = ['contractionFor', 'token', 'cardinality', 'proto', 'concepts']



export function makeLexeme(data: Partial<Lexeme>): Lexeme {

    if (data instanceof LexemeObject) {
        return data
    }

    return new LexemeObject(data)

}


class LexemeObject implements Lexeme /*, Wrapper */ {

    readonly _root = this.newData?._root

    constructor(
        readonly newData?: Partial<Lexeme>
    ) {
        thisIsRidiculous.forEach(k => {
            (this as any)[k] = (newData as any)[k] ?? (this._root ?? {})[k]
        })

    }

    get root() {

        if (this._root) {
            return this._root.root
        }

        return this.newData?.root as any
    }

    get type(): LexemeType {

        if (this._root) {
            return (this._root as Lexeme).type
        }

        return this.newData?.type as any
    }

    get isPlural() {
        return isRepeatable(this.newData?.cardinality)
    }

    get isConcept() {
        return this?.type === 'noun' && (this as any).concepts && !(this as any).proto
    }

}