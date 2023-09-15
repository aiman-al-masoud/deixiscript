from functools import cmp_to_key, partial
from typing import Iterable, Literal, Sequence, TypeVar
from expbuilder import e, it_is_false_that
from language import AnalyticDerivation, Ast
from KnowledgeBase import KnowledgeBase

T = TypeVar('T', bound=Ast)

def sortByGenerality(kb:KnowledgeBase, asts:Iterable[T]):
    cmp = partial(compareAst, kb)
    res = sorted(asts, key=cmp_to_key(cmp))
    return res

def compareAst(kb:KnowledgeBase, ast1:Ast, ast2:Ast)->Literal[-1,0,1]:

    match ast1, ast2:
        case AnalyticDerivation(d1, _), AnalyticDerivation(d2, _):
            return compareAst(kb, d1, d2)
        case _:
            m1 = matchAst(ast1, ast2, kb)
            m2 = matchAst(ast2, ast1, kb)

            if m1 and m2: return 0
            return 1 if m1 and not m2 else -1

#
# Two expressions are synonymous in a context kb, when
# their truth values (or referents) co-vary in kb.
#
def matchAst(generic:Ast, specific:Ast, kb:KnowledgeBase=KnowledgeBase.empty):

    if generic == specific: return True

    with1 = e(specific).tell(kb)
    with2 = e(generic).get(with1.kb)
 
    without1 = it_is_false_that(specific).tell(kb)
    without2 = e(generic).get(without1.kb)

    return areConcordant(with1.head, with2) and not without2

def areConcordant(ast1:Ast, ast2:Ast):
    if isinstance(ast1, tuple): return ast2 in ast1
    if isinstance(ast2, tuple): return ast1 in ast2
    return ast1 == ast2

