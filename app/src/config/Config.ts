import { Lexeme } from "../lexer/Lexeme"
import { AstType, AtomNode, CompositeNode, Member, Role } from "../parser/ast-types"
import { LexemeType } from "./LexemeType"
import { lexemes } from "./lexemes"
import { getSyntax, setSyntax } from "./syntaxes"
import { startupCommands } from "./startupCommands"
import { constituentTypes, ConstituentType } from "./syntaxes"
import { lexemeTypes } from "./LexemeType"

export interface Config {
    readonly lexemes: Lexeme<LexemeType>[]
    getSyntax(name: AstType): Member[]
    readonly startupCommands: string[]
    readonly constituentTypes: ConstituentType[]
    readonly lexemeTypes: LexemeType[]
    setSyntax(name: string, members: Member[]): void
}

export function getConfig(): Config {
    return {
        lexemes,
        getSyntax,
        startupCommands,
        constituentTypes,
        lexemeTypes,
        setSyntax,
    }
}

export function handleMacro(macro: CompositeNode<'macro'>, config: Config) {

    const noun = macro.links.noun
    const copula = macro.links.copula
    const macroparts = (macro.links.macropart as any).links as CompositeNode<'macropart'>[]

    const members = macroparts.map(m => handleMacroPart(m))
    const name = (noun as any).lexeme.root

    // console.log({ members, name })
    // config.lexemes.push({ type: 'grammar', root: name })
    // config.constituentTypes.push(name)
    config.setSyntax(name, members)

}

function handleMacroPart(macroPart: CompositeNode<'macropart'>): Member {

    const adjectives: Lexeme<LexemeType>[] = (macroPart.links?.adj as any)?.links?.map((a: any) => a.lexeme) ?? []
    const taggedUnions = (macroPart.links.taggedunion as any).links as CompositeNode<'taggedunion'>[]
    const grammars = taggedUnions.map(x => x.links.grammar)

    const quantadjs = adjectives.filter(a => a.cardinality)
    const qualadjs = adjectives.filter(a => !a.cardinality)

    return {
        type: grammars.map(g => (g as any).lexeme.token),
        role: qualadjs.at(0)?.root as Role,
        number: quantadjs.at(0)?.cardinality
    }
}