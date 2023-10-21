from core.language import Ast, Explicit

def subst(
    old:Ast,
    new:Ast,
    ast:Ast,
):
    if ast==old: 
        return new
    elif isinstance(ast, Explicit): 
        return ast
    else:
        d = {k: subst(old,new,v) for k, v in vars(ast).items()}
        return ast.__class__(**d)