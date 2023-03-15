import { Context } from "../../facade/context/Context"
import { isRepeatable } from "../parser/interfaces/Cardinality"
import { conjugate } from "./functions/conjugate"
import { pluralize } from "./functions/pluralize"
import { Lexeme, makeLexeme } from "./Lexeme"
import { makeGetter } from "./makeGetter"
import { makeSetter } from "./makeSetter"

export default class LexemeObject implements Lexeme {

    _root = this.newData?._root
    readonly root = this.newData?.root ?? this._root?.root!
    readonly type = this.newData?.type ?? this._root?.type!
    contractionFor = this.newData?.contractionFor ?? this._root?.contractionFor
    token = this.newData?.token ?? this._root?.token
    cardinality = this.newData?.cardinality ?? this._root?.cardinality
    readonly isVerb = this.type === 'mverb' || this.type === 'iverb'
    readonly isPlural = isRepeatable(this.newData?.cardinality)
    readonly isMultiWord = this.root.includes(' ')

    proto = this.newData?.proto ?? this._root?.proto
    concepts = this.newData?.concepts ?? this._root?.concepts
    heirlooms = this?.newData?.heirlooms ?? this._root?.heirlooms ?? []

    constructor(
        readonly newData?: Partial<Lexeme>
    ) { }

    get isConcept() {
        return this?.type === 'noun' && (this as any).concepts && !(this as any).proto
    }

    getProto(): object | undefined {//TODO: maybe return Object.prototype by default
        return (window as any)?.[this.proto as any]?.prototype;
    }

    extrapolate(context: Context): Lexeme[] {

        if ((this.type === 'noun' || this.type === 'grammar') && !this.isPlural) {
            return [makeLexeme({ _root: this, token: pluralize(this.root), cardinality: '*' })]
        }

        if (this.isVerb) {
            return conjugate(this.root).map(x => makeLexeme({ _root: this, token: x }))
        }

        return []
    }

    setAlias = (name: string, path: string[]) => {

        this.heirlooms.push({
            name,
            set: makeSetter(path),
            get: makeGetter(path),
        })

    }

}