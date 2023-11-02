from typing import Sequence
from core.Ast import Ast
from core.KB import KB, WorldModel


def show(wm:WorldModel):
    from graphviz import Source
    source = graphvizied(wm)
    Source(source, filename='tmp.gv', format='png').view()

def save_png(kb:KB):
    from graphviz import Source
    source = graphvizied(kb.wm, kb.it.unroll())
    Source(source, filename='tmp.gv', format='png').render()

def graphvizied(wm:WorldModel, head:Sequence[Ast]=[]):
    from functools import reduce
    x0=[f'"{x}" [fillcolor=red,style=filled];' for x in head]
    x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in wm]
    x2=reduce(lambda a,b:a+b+'\n', [*x0, *x1], '')
    x3=f'digraph G{{\n{x2}}}'
    return x3

# def ast_to_graphviz(ast:Ast):
#     raise Exception
