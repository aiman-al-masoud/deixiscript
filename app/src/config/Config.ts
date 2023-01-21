import { Lexeme } from "../lexer/Lexeme"
import { AstType, AtomNode, CompositeNode, Member } from "../parser/ast-types"
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

    //TODO: decide how to hint at "multiple possible types". 
    //TODO: refactor hardcoded 'optional' string
    const adjectives = (macroPart.links?.adj as any)?.links?.map((a: any) => a.lexeme.root) ?? []
    const grammar = macroPart.links?.grammar as AtomNode<'grammar'>
    return { type: [grammar.lexeme.token as LexemeType], role: adjectives.filter((x: any) => x != 'optional').at(0), number: adjectives.includes('optional') ? '1|0' : 1 }

}