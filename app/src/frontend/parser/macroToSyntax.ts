import { Macro, Macropart, Role } from "./interfaces/AstNode"
import { Member, AstType } from "./interfaces/Syntax"

export function macroToSyntax(macro: Macro) {

    const macroparts = macro.links.macropart.list ?? []
    const syntax = macroparts.map(m => macroPartToMember(m))
    const name = macro.links.subject.lexeme.root

    if (!name) {
        throw new Error('Anonymous syntax!')
    }

    return { name, syntax }
}

function macroPartToMember(macroPart: Macropart): Member {

    const adjectiveNodes = macroPart.links?.adjective?.list ?? []
    const adjectives = adjectiveNodes.flatMap(a => a.lexeme ?? [])

    const taggedUnions = macroPart.links?.taggedunion?.list ?? []
    const grammars = taggedUnions.map(x => x.links?.noun)

    const quantadjs = adjectives.filter(a => a.cardinality)
    const qualadjs = adjectives.filter(a => !a.cardinality)

    const exceptUnions = macroPart.links?.exceptunion?.links?.taggedunion?.list ?? []
    const notGrammars = exceptUnions.map(x => x.links?.noun)

    return {
        type: grammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
        role: qualadjs.at(0)?.root as Role,
        number: quantadjs.at(0)?.cardinality,
        exceptType: notGrammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
    }

}
