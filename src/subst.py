from typing import Callable
from language import Ast, Explicit


def subst(old:Callable[[Ast], bool]):

    def f1(new:Callable[[Ast], Ast]):

        def f2(ast:Ast):
            if old(ast): return new(ast)
            if isinstance(ast, tuple): return tuple(subst(old)(new)(v) for v in ast)
            if isinstance(ast, Explicit): return ast
            d = {k: subst(old)(new)(v) for k, v in ast.__dict__.items()}
            return ast.__class__(**d)

        return f2

    return f1

def rp(old:Ast, new:Ast, ast:Ast):
    return subst(lambda x:x==old)(lambda _:new)(ast)


# replace()
# f = substt(1)(2)

# isCommandVerbSen = lambda x:isinstance(x, VerbSentence) and bool(x.command)
# expandCommands = replace(isCommandVerbSen)(lambda x:Command(x))


# def subst(old:Callable[[Ast], bool] | Ast, new:Callable[[Ast], Ast] | Ast, ast:Ast):

#     if isinstance(old, Ast):
#         return subst(lambda x: x == old, new, ast)

#     if isinstance(new, Ast):
#         return subst(old, lambda _:new, ast)

#     if old(ast): return new(ast)

#     if isinstance(ast, tuple): return tuple([ subst(old, new, v) for v in ast])
#     if isinstance(ast, Explicit): return ast

#     d = {k: subst(old, new, v) for k, v in ast.__dict__.items()}

#     return ast.__class__(**d)

# # # def subst(ast:Ast, old:Ast, new:Ast)->Ast:
# # def subst(old:Ast, new:Ast, ast:Ast,)->Ast:
# #     return substF(old, new, ast)
# # subst = substF

# # def substt(x):
# #     return substt

# # substt(lambda x:x)(lambda y:y)(1)



