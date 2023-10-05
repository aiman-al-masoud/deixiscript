from typing import Callable
from core.language import Ast, Explicit

def subst(
    old:Callable[[Ast], bool]|Ast, 
    new:Callable[[Ast], Ast]|Ast, 
    ast:Ast,
):

    if old(ast) if callable(old) else old==ast:
        return new(ast) if callable(new) else new

    if isinstance(ast, tuple): return tuple(subst(old,new,v) for v in ast)
    if isinstance(ast, Explicit): return ast
    d = {k: subst(old,new,v) for k, v in vars(ast).items()}
    return ast.__class__(**d)

