import sys
import os
path = os.path.split(os.path.split(__file__)[0])[0]
sys.path.append(path)
from core.KnowledgeBase import WorldModel
from core.expbuilder import the

def show(wm:WorldModel):
    from graphviz import Source
    source = graphvizied(wm)
    Source(source, filename='tmp.gv', format='png').view()

def graphvizied(wm:WorldModel):
    from functools import reduce
    x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in wm]
    x2=reduce(lambda a,b:a+b+'\n', x1, '')
    x3=f'digraph G{{\n{x2}}}'
    return x3

def test_c41():
    kb0 = the('horse').tell()
    kb1 = the('man').tell(kb0)
    kb2 = the('man').does('ride').on(the('horse')).tell(kb1)
    kb3 = the('horse').does('move').tell(kb2)
    kb4 = the('man').does('yell').tell(kb3)
    show(kb4.wm)
 
test_c41()