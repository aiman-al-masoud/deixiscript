from core.KB import KB


def show(kb:KB):
    from graphviz import Source
    source = graphvizied(kb)
    Source(source, filename='tmp.png').view()

def save_png(kb:KB):
    from graphviz import Source
    source = graphvizied(kb)
    Source(source, filename='tmp.gv', format='png').render()

def graphvizied(kb:KB):
    from functools import reduce
    x0=[f'"{x}" [fillcolor=red,style=filled];' for x in kb.it.unroll()]
    x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in kb.wm]
    x2=reduce(lambda a,b:a+b+'\n', [*x0, *x1], '')
    x3=f'digraph G{{\n{x2}}}'
    return x3

# def ast_to_graphviz(ast:Ast):
#     raise Exception
