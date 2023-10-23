from functools import reduce
from typing import Dict
from core.language import Ast

def subst(
    old:Ast,
    new:Ast,
    ast:Ast,
):
    return ast.subst({old:new})


def substDict(map:Dict[Ast, Ast], ast:Ast):
    return reduce(lambda a,b: subst(b[0], b[1], a), map.items(), ast)
