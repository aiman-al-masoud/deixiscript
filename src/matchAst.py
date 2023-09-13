from expbuilder import e, it_is_false_that
from language import Ast, KnowledgeBase, NounPhrase


#
# Two expressions are synonymous in a context kb, when
# their truth values (or referents) co-vary in kb.
#
def matchAst(template:Ast, ast:Ast, kb:KnowledgeBase):
    with1 = e(ast).tell(kb)
    with2 = e(template).get(with1.kb)

    without1 = it_is_false_that(ast).tell(kb)
    without2 = e(template).get(without1.kb)

    return areConcordant(with1.head, with2) and not without2

def areConcordant(ast1:Ast, ast2:Ast):
    if isinstance(ast1, tuple): return ast2 in ast1
    if isinstance(ast2, tuple): return ast1 in ast2
    return ast1 == ast2

# What about analytic derivation clauses?
