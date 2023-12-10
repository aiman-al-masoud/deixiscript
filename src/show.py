from functools import reduce
from typing import List, Tuple
from kb import KB

def graphvizied(kb:KB):
    edges:List[Tuple[str, str, str]]=[]
    for id, thing in enumerate(kb.wm):
        for k, v in thing.items():
            edges.append((str(id), str(v), k))

    x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in edges]
    x2=reduce(lambda a,b:a+b+'\n', x1, '')
    x3=f'digraph G{{\n{x2}}}'
    return x3

def show(kb:KB):
    from graphviz import Source
    source = graphvizied(kb)
    Source(source, filename='tmp.png').view()