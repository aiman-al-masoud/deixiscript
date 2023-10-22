from functools import reduce
from typing import Dict
from core.language import Ast, Explicit, Implicit

def subst(
    old:Ast,
    new:Ast,
    ast:Ast,
):
    if ast==old: 
        return new
    elif isinstance(ast, Explicit): 
        return ast
    elif isinstance(ast, Implicit) and ast.which!=True:
        return ast
    else:
        d = {k: subst(old,new,v) for k, v in vars(ast).items()}
        return ast.__class__(**d)


def substDict(map:Dict[Ast, Ast], ast:Ast):
    return reduce(lambda a,b: subst(b[0], b[1], a), map.items(), ast)
