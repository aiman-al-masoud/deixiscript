from functools import cmp_to_key, partial
from typing import Iterable, TypeVar
from core.language import AnalyticDerivation, Ast, BinExp, Implicit, SimpleSentence, SyntheticDerivation
from core.KnowledgeBase import KnowledgeBase


T = TypeVar('T', bound=Ast)

def sortByGenerality(kb:KnowledgeBase, asts:Iterable[T]):
    cmp = partial(compareByGenerality, kb)
    x1 = sorted(asts, key=cmp_to_key(cmp))
    x2 = tuple(x1)
    return x2

def compareByGenerality(kb:KnowledgeBase, ast1:Ast, ast2:Ast)->int:

    match ast1, ast2:
        case AnalyticDerivation(definendum=d1, definition=_), AnalyticDerivation(definendum=d2, definition=_):
            return compareByGenerality(kb, d1, d2)
        case SyntheticDerivation(cause=c1, effect=_), SyntheticDerivation(cause=c2, effect=_):
            return compareByGenerality(kb, c1, c2)
        case _:
            m1, m2 = isMatch(ast1, ast2), isMatch(ast2, ast1)
            return m1 - m2

def isMatch(sup:Ast, sub:Ast)->bool:

    match sup, sub:
        case str()|int()|float(), str()|int()|float():
            return sub==sup
        case Implicit(), Implicit():
            
            # if sup.card > sub.card: return False
            return isMatch(sup.head, sub.head) and isMatch(sup.which, sub.which)

        case SimpleSentence(), SimpleSentence():

            if sup.verb != sub.verb: return False
            
            return isMatch(sup.subject, sub.subject)                   and\
                   (not sup.object or isMatch(sup.object, sub.object)) and\
                   (not sup.as_    or isMatch(sup.as_, sub.as_))       and\
                   (not sup.to     or isMatch(sup.to, sub.to))         and\
                   (not sup.on     or isMatch(sup.on, sub.on))

        case SimpleSentence(), BinExp(op='and'):          
            return isMatch(sup, sub.left) or isMatch(sup, sub.right)

        case SimpleSentence(), BinExp(op='or'):
            raise Exception()

        case BinExp(op='and'), SimpleSentence():
            return isMatch(sup.left, sub) and isMatch(sup.right, sub)

        case BinExp(op='or'), SimpleSentence():
            return isMatch(sup.left, sub) or isMatch(sup.right, sub)

        case BinExp(op='and'|'or'), BinExp(op='and'|'or'):

            return isMatch(sup.left,  sub.left) and\
            isMatch(sup.right, sub.right)       and\
            isMatch(sup.left,  sub.right)       and\
            isMatch(sup.right, sub.left)

        case True, _:
            return True

        case _:
            return False
            # raise Exception(sup, sub)