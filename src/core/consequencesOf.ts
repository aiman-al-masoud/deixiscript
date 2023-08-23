import { definitionOf } from "./definitionOf.ts"
import { match } from "./match.ts"
import { subst } from "./subst.ts"
import { LLangAst, KnowledgeBase, isAfterDerivationClause } from "./types.ts"


export function consequencesOf(ast: LLangAst, kb: KnowledgeBase): LLangAst[] {

  // console.log('ast=', ast)

  return kb.derivClauses.filter(isAfterDerivationClause).flatMap(dc => {
    const map = match(definitionOf(dc.after, kb) ?? dc.after, definitionOf(ast, kb) ?? ast, kb)
    if (!map) return []
    const conseq = subst(dc.conseq, map)
    return [conseq]
  })

}
