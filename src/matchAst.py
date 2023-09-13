from typing import Literal
from expbuilder import e, it_is_false_that
from language import Ast, KnowledgeBase


def cmprGener(kb:KnowledgeBase, ast1:Ast, ast2:Ast)->Literal['LE', 'EQ', 'GE', 'NE']:
   
    m1 = matchAst(ast1, ast2, kb)
    m2 = matchAst(ast2, ast1, kb)

    match m1, m2:
        case True, True:
            return 'EQ'
        case True, False:
            return 'GE'
        case False, True:
            return 'LE'
        case _:
            return 'NE'        

#
# Two expressions are synonymous in a context kb, when
# their truth values (or referents) co-vary in kb.
#
def matchAst(generic:Ast, specific:Ast, kb:KnowledgeBase):
    with1 = e(specific).tell(kb)
    with2 = e(generic).get(with1.kb)
 
    without1 = it_is_false_that(specific).tell(kb)
    without2 = e(generic).get(without1.kb)

    # return areConcordant(with1.head, with2) and not without2
    return areConcordant(with1.head, with2) and (areConcordant(without1.head, without2) or not without2)


def areConcordant(ast1:Ast, ast2:Ast):
    if isinstance(ast1, tuple): return ast2 in ast1
    if isinstance(ast2, tuple): return ast1 in ast2
    return ast1 == ast2

# What about analytic derivation clauses?
