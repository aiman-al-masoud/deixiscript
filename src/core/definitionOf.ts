import { deepMapOf } from "../utils/DeepMap.ts"
import { first } from "../utils/first.ts"
import { $ } from "./exp-builder.ts";
import { match } from "./match.ts"
import { subst } from "./subst.ts"
import { LLangAst, KnowledgeBase, isConst, astsEqual, isWhenDerivationClause, AstMap } from "./types.ts"


export function definitionOf(ast: LLangAst, kb: KnowledgeBase): LLangAst | undefined {

  if (ast.type === 'conjunction') {
    const f1 = definitionOf(ast.f1, kb)
    const f2 = definitionOf(ast.f2, kb)
    if (!f1 && !f2) return undefined
    return $(f1 ?? ast.f1).and(f2 ?? ast.f2).$
  }

  return first(kb.derivClauses.filter(isWhenDerivationClause), dc => {

    const matchF = getMatchFunction(ast)
    const map = matchF(dc.conseq, ast, kb)
    if (!map) return

    const res = subst(dc.when, map)
    return res
  })
}

function strictMatch(t: LLangAst, f: LLangAst) {
  if (astsEqual(t, f)) return deepMapOf() as AstMap
}

function getMatchFunction(ast: LLangAst) {

  if (isConst(ast)) return strictMatch

  return match
}