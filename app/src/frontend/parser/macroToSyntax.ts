import { Macro, Macropart, Role } from "./interfaces/AstNode"
import { Member, AstType } from "./interfaces/Syntax"

export function macroToSyntax(macro: Macro) {

    const macroparts = macro.macropart.list ?? []
    const syntax = macroparts.map(m => macroPartToMember(m))
    const name = macro.subject.lexeme.root

    if (!name) {
        throw new Error('Anonymous syntax!')
    }

    return { name, syntax }
}

function macroPartToMember(macroPart: Macropart): Member {

    const adjectiveNodes = macroPart?.adjective?.list ?? []
    const adjectives = adjectiveNodes.flatMap(a => a.lexeme ?? [])

    const taggedUnions = macroPart?.taggedunion?.list ?? []
    const grammars = taggedUnions.map(x => x?.noun)

    const quantadjs = adjectives.filter(a => a.cardinality)
    const qualadjs = adjectives.filter(a => !a.cardinality)

    const exceptUnions = macroPart?.exceptunion?.taggedunion?.list ?? []
    const notGrammars = exceptUnions.map(x => x?.noun)

    return {
        types: grammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
        role: qualadjs.at(0)?.root as Role,
        number: quantadjs.at(0)?.cardinality,
        exceptTypes: notGrammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
    }

}
