import { AstNode, Role } from "./interfaces/AstNode"
import { Syntax, Member, AstType } from "./interfaces/Syntax"

export function macroToSyntax(macro: AstNode<AstType>): { name: string, syntax: Syntax } {

    const macroparts = macro?.links?.macropart?.list ?? []
    const syntax = macroparts.map(m => macroPartToMember(m))
    const name = macro?.links?.noun?.lexeme?.root

    if (!name) {
        throw new Error('Anonymous syntax!')
    }

    return { name, syntax }
}

function macroPartToMember(macroPart: AstNode<AstType>): Member {

    const adjectiveNodes = macroPart.links?.adjective?.list ?? []
    const adjectives = adjectiveNodes.flatMap(a => a.lexeme ?? [])

    const taggedUnions = macroPart.links?.taggedunion?.list ?? []
    const grammars = taggedUnions.map(x => x.links?.grammar)

    const quantadjs = adjectives.filter(a => a.cardinality)
    const qualadjs = adjectives.filter(a => !a.cardinality)

    return {
        type: grammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
        role: qualadjs.at(0)?.root as Role,
        number: quantadjs.at(0)?.cardinality
    }

}
