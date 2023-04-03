import { Context } from "../../facade/context/Context"
import { isRepeatable } from "../parser/interfaces/Cardinality"
import { conjugate } from "./functions/conjugate"
import { pluralize } from "./functions/pluralize"
import { Lexeme, makeLexeme } from "./Lexeme"

export default class BaseLexeme implements Lexeme {

    _root = this.newData?._root
    readonly root = this.newData?.root ?? this._root?.root!
    readonly type = this.newData?.type ?? this._root?.type!
    contractionFor = this.newData?.contractionFor ?? this._root?.contractionFor
    token = this.newData?.token ?? this._root?.token
    cardinality = this.newData?.cardinality ?? this._root?.cardinality
    readonly isVerb = this.type === 'mverb' || this.type === 'iverb'
    readonly isPlural = isRepeatable(this.newData?.cardinality)
    readonly referent = this.newData?.referent ?? this._root?.referent

    constructor(
        readonly newData?: Partial<Lexeme>
    ) { }

    extrapolate(context: Context): Lexeme[] {

        if ((this.type === 'noun' || this.type === 'grammar') && !this.isPlural) {
            return [makeLexeme({ _root: this, token: pluralize(this.root), cardinality: '*' })]
        }

        if (this.isVerb) {
            return conjugate(this.root).map(x => makeLexeme({ _root: this, token: x }))
        }

        return []
    }

}