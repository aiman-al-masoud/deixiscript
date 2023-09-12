from typing import Callable
from language import Ast, Explicit


def subst(old:Callable[[Ast], bool]|Ast):

    def f1(new:Callable[[Ast], Ast]|Ast):

        def f2(ast:Ast):
            if  old==ast if isinstance(old, Ast) else old(ast): 
                return new if isinstance(new, Ast) else new(ast)
            if isinstance(ast, tuple): return tuple(subst(old)(new)(v) for v in ast)
            if isinstance(ast, Explicit): return ast
            d = {k: subst(old)(new)(v) for k, v in ast.__dict__.items()}
            return ast.__class__(**d)

        return f2

    return f1
