from language import Ast, Explicit

def subst(ast:Ast, old:Ast, new:Ast)->Ast:

    if ast==old: return new

    if isinstance(ast, tuple): return tuple([ subst(v, old, new) for v in ast])
    if isinstance(ast, Explicit): return ast

    d = {k: subst(v, old, new) for k, v in ast.__dict__.items()}

    return ast.__class__(**d)


