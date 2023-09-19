from functools import cmp_to_key, partial
from typing import Iterable, Literal, TypeVar
from expbuilder import e, it_is_false_that
from language import AnalyticDerivation, Ast
from KnowledgeBase import KnowledgeBase
from linearize import linearize

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
            m1 = matchAst(ast1, ast2, kb)
            m2 = matchAst(ast2, ast1, kb)

            if m1 == m2: return 0
            return 1 if m1 else -1

#
# Two expressions are synonymous in a context kb, when
# their truth values (or referents) co-vary in kb.
#
def matchAst(generic:Ast, specific:Ast, kb:KnowledgeBase=KnowledgeBase.empty):

    if generic == specific: return True

    with1 = e(specific).tell(kb)
    with2 = e(generic).get(with1.kb)
 
    # TODO: removing specific from KB may still leave out other similar sentneces!
    # itisfalsethat generic (instead of specific) in 'without1'?
    # TODO: need to call evaluate() recursively from ask()/tell(), cuz:
    # - Simple get/ask() called on noun phrase does not resolve
    # implicit references, it stupidly checks args as they are and returns false.
    # - Calling tell() on negation of generic should remove all synonymous
    # facts from KB.

    without1 = it_is_false_that(specific).tell(kb)
    without2 = e(generic).get(without1.kb)

    return agree(with1.head, with2) and not agree(without1.head, without2)

def agree(ast1:Ast, ast2:Ast):

    if ast1==ast2: return True
    if isinstance(ast1, tuple): return ast2 in set(ast1)
    if isinstance(ast2, tuple): return agree(ast2, ast1)


