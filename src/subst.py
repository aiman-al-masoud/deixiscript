from typing import Callable
from language import Ast, Explicit

def substF(old:Callable[[Ast], bool] | Ast, makeNew:Callable[[Ast], Ast] | Ast, ast:Ast):

    if isinstance(old, Ast):
        return substF(lambda x: x == old, makeNew, ast)

    if isinstance(makeNew, Ast):
        return substF(old, lambda _:makeNew, ast)

    if old(ast): return makeNew(ast)

    if isinstance(ast, tuple): return tuple([ substF(old, makeNew, v) for v in ast])
    if isinstance(ast, Explicit): return ast

    d = {k: substF(old, makeNew, v) for k, v in ast.__dict__.items()}

    return ast.__class__(**d)

def subst(ast:Ast, old:Ast, new:Ast)->Ast:
    return substF(old, new, ast)

# subst = substF