import { Lexeme } from "../lexer/Lexeme"
import { CompositeNode, Role } from "./interfaces/AstNode"
import { Syntax, Member } from "./interfaces/Syntax"

export function macroToSyntax(macro: CompositeNode<'macro'>): { name: string, syntax: Syntax } {
    const macroparts = (macro.links.macropart as any).links as CompositeNode<'macropart'>[]
    const syntax = macroparts.map(m => macroPartToMember(m))
    const name = (macro.links.noun as any).lexeme.root
    return { name, syntax }
}

function macroPartToMember(macroPart: CompositeNode<'macropart'>): Member {

    const adjectives: Lexeme[] = (macroPart.links?.adj as any)?.links?.map((a: any) => a.lexeme) ?? []
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
