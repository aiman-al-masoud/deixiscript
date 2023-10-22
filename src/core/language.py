from typing import Sequence, TypeVar
from core.binexp import BinExp
from core.composite import Composite
from core.explicit import Explicit, Str
from core.implicit import Implicit


NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | Composite
# Composite = Implicit | BinExp | SimpleSentence | Def | Law


GAP=Str('_')
'''linguistic gap denoting the empty noun-phrase'''

T = TypeVar('T', bound='Ast')
def copy(ast:T, **kwargs:Ast)->T:
    if isinstance(ast, Explicit): return ast
    return ast.__class__(**{**vars(ast), **kwargs})

def unroll(ast:BinExp)->Sequence[Ast]:
    x1= unroll(ast.left) if isinstance(ast.left, BinExp) else [ast.left]
    x2= unroll(ast.right) if isinstance(ast.right, BinExp) else [ast.right]
    return [*x1, *x2]

