from functools import cmp_to_key
from typing import Iterable, TypeVar
from core.isMatch import isMatch
from core.language import Ast


T = TypeVar('T', bound=Ast)

def sortByGenerality(asts:Iterable[T]):
    x1 = sorted(asts, key=cmp_to_key(compareByGenerality))
    x2 = tuple(x1)
    return x2

def compareByGenerality(ast1:Ast, ast2:Ast)->int:
    return isMatch(ast1, ast2) - isMatch(ast2, ast1)