from functools import cmp_to_key, partial
from typing import Iterable, Literal, TypeVar
from core.expbuilder import e, it_is_false_that
from core.language import AnalyticDerivation, Ast
from core.KnowledgeBase import KnowledgeBase

T = TypeVar('T', bound=Ast)

def sortByGenerality(kb:KnowledgeBase, asts:Iterable[T]):
    cmp = partial(compareByGenerality, kb)
    res = sorted(asts, key=cmp_to_key(cmp))
    return res

def compareByGenerality(kb:KnowledgeBase, ast1:Ast, ast2:Ast)->Literal[-1,0,1]:

    match ast1, ast2:
        case AnalyticDerivation(d1, _), AnalyticDerivation(d2, _):
            return compareByGenerality(kb, d1, d2)
        case _:
            m1 = isMatch(ast1, ast2, kb)
            m2 = isMatch(ast2, ast1, kb)

            if m1 == m2: return 0
            return 1 if m1 else -1

def isMatch(generic:Ast, specific:Ast, kb:KnowledgeBase=KnowledgeBase()):

    if generic == specific: return True

    with1 = e(specific).tell(kb)
    with2 = e(generic).get(with1.kb)

    without1 = it_is_false_that(generic).tell(kb)
    without2 = e(specific).get(without1.kb)

    return not without2 and with2 
