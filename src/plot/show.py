from core.language import Ast
from core.KnowledgeBase import WorldModel

def show(wm:WorldModel):
    from graphviz import Source
    source = graphvizied(wm)
    Source(source, filename='tmp.gv', format='png').view()

def save_png(wm:WorldModel):
    from graphviz import Source
    source = graphvizied(wm)
    Source(source, filename='tmp.gv', format='png').render()

def graphvizied(wm:WorldModel):
    from functools import reduce
    x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in wm]
    x2=reduce(lambda a,b:a+b+'\n', x1, '')
    x3=f'digraph G{{\n{x2}}}'
    return x3

def ast_to_graphviz(ast:Ast):
    raise Exception()
