import { Lexeme } from "../lexer/Lexeme"
import { AstType, CompositeNode, Member, Role } from "../parser/ast-types"
import { LexemeType } from "./LexemeType"
import { ConstituentType } from "./syntaxes"
import { Config } from "./Config"

export class BasicConfig implements Config {

    constructor(
        readonly lexemes: Lexeme<LexemeType>[],
        readonly lexemeTypes: LexemeType[],
        readonly _constituentTypes: ConstituentType[],
        readonly syntaxes: { [name in ConstituentType]: Member[] },
        readonly startupCommands: string[]) {
    }

    get constituentTypes() {
        return this._constituentTypes.slice().sort((a, b) => this.maxPrecedence(b, a))
    }

    setSyntax = (macro: CompositeNode<"macro">): void => {

        const noun = macro.links.noun
        const macroparts = (macro.links.macropart as any).links as CompositeNode<'macropart'>[]
        const members = macroparts.map(m => macroPartToMember(m))
        const name = (noun as any).lexeme.root

        this.lexemes.push({ type: 'grammar', root: name }) //TODO: may need to remove old if reassigning! 
        this._constituentTypes.push(name) //TODO: check duplicates?
        this.syntaxes[name as ConstituentType] = members

    }

    getSyntax = (name: AstType): Member[] => {
        return this.syntaxes[name as ConstituentType] ?? [{ type: [name], number: 1 }] // TODO: problem, adj is not always 1 !!!!!!
    }

    protected dependencies(a: AstType): AstType[] {
        return (this.syntaxes[a as ConstituentType] ?? []).flatMap(m => m.type)
    }

    protected staticCompare(a: AstType, b: AstType) {

        const ascendingPrecedence = this._constituentTypes.slice(0, 4) as any

        const pa = ascendingPrecedence.indexOf(a)
        const pb = ascendingPrecedence.indexOf(b)

        if (pa === -1 || pb === -1) { // either one is custom
            return undefined
        }

        return pa - pb
    }

    protected lenCompare = (a: AstType, b: AstType) => {
        return this.dependencies(a).length - this.dependencies(b).length
    }

    protected idCompare = (a: AstType, b: AstType) => {
        return a == b ? 0 : undefined
    }

    protected dependencyCompare = (a: AstType, b: AstType) => {

        const aDependsOnB = this.dependencies(a).includes(b)
        const bDependsOnA = this.dependencies(b).includes(a)

        if (aDependsOnB === bDependsOnA) {
            return undefined
        }

        return aDependsOnB ? 1 : -1

    }

    protected maxPrecedence = (a: AstType, b: AstType) => {

        const sp = this.idCompare(a, b) ??
            this.staticCompare(a, b) ??
            this.dependencyCompare(a, b) ??
            this.lenCompare(a, b)

        return sp

    }

}

function macroPartToMember(macroPart: CompositeNode<'macropart'>): Member {

    const adjectives: Lexeme<LexemeType>[] = (macroPart.links?.adj as any)?.links?.map((a: any) => a.lexeme) ?? []
    const taggedUnions = (macroPart.links.taggedunion as any).links as CompositeNode<'taggedunion'>[]
    const grammars = taggedUnions.map(x => x.links.grammar)

    const quantadjs = adjectives.filter(a => a.cardinality)
    const qualadjs = adjectives.filter(a => !a.cardinality)

    return {
        type: grammars.map(g => (g as any).lexeme.root),
        role: qualadjs.at(0)?.root as Role,
        number: quantadjs.at(0)?.cardinality
    }

}