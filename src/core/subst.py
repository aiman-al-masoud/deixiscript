from core.language import Ast, Explicit

def subst(
    old:Ast,
    new:Ast,
    ast:Ast,
):

    match ast:
        case _ if ast==old:
            return new
        case tuple():
            return tuple(subst(old,new,v) for v in ast)
        case _ if isinstance(ast, Explicit):
            return ast
        case _:
            d = {k: subst(old,new,v) for k, v in vars(ast).items()}
            return ast.__class__(**d)
