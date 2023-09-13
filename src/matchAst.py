from expbuilder import e, it_is_false_that
from language import Ast, KnowledgeBase, NounPhrase


#
# Two expressions are synonymous in a context kb, when
# their truth values (or referents) co-vary in kb.
#
def matchAst(template:Ast, ast:Ast, kb:KnowledgeBase):
    withAst = e(ast).tell(kb)
    tempWith = e(template).get(withAst.kb)

    withoutAst = it_is_false_that(ast).tell(kb)
    tempWithout = e(template).get(withoutAst.kb)

    return areConcordant(tempWith, withAst.head) and not tempWithout

def areConcordant(ast1:Ast, ast2:Ast):
    if isinstance(ast1, tuple): return ast2 in ast1
    if isinstance(ast2, tuple): return ast1 in ast2
    return ast1 == ast2

# What about analytic derivation clauses?
