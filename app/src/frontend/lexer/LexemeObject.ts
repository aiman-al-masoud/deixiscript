import { LexemeType } from "../../config/LexemeType"
import { Context } from "../../facade/context/Context"
import { isRepeatable } from "../parser/interfaces/Cardinality"
import { conjugate } from "./functions/conjugate"
import { pluralize } from "./functions/pluralize"
import { Lexeme, makeLexeme } from "./Lexeme"
import { makeGetter } from "./makeGetter"
import { makeSetter } from "./makeSetter"

export default class LexemeObject implements Lexeme {

    _root = this.newData?._root
    contractionFor = this.newData?.contractionFor ?? this._root?.contractionFor
    token = this.newData?.token ?? this._root?.token
    cardinality = this.newData?.cardinality ?? this._root?.cardinality
    proto = this.newData?.proto ?? this._root?.proto
    concepts = this.newData?.concepts ?? this._root?.concepts
    heirlooms = this?.newData?.heirlooms ?? this._root?.heirlooms ?? []

    constructor(
        readonly newData?: Partial<Lexeme>
    ) {

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

    extrapolate(context: Context): Lexeme[] {

        if ((this.type === 'noun' || this.type === 'grammar') && !this.isPlural) {
            return [makeLexeme({ _root: this, token: pluralize(this.root), cardinality: '*' })]
        }

        if (['iverb', 'mverb'].includes(this.type)) {
            return conjugate(this.root).map(x => makeLexeme({ _root: this, token: x }))
        }

        return []
    }

    get isMultiWord() {
        return this.root.includes(' ');
    }

    getProto(): object | undefined {
        return (window as any)?.[this.proto as any]?.prototype;
    }

    setAlias = (alias: string, path: string[]) => {

        this.heirlooms.push({
            set: makeSetter(alias, path),
            get: makeGetter(alias, path),
            name: alias,
            path
        })

    }

}