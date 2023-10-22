from typing import Sequence
from core.binexp import BinExp
from core.composite import Composite
from core.explicit import Explicit, Str
from core.implicit import Implicit


NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | Composite

GAP=Str('_')
'''linguistic gap denoting the empty noun-phrase'''

def unroll(ast:BinExp)->Sequence[Ast]:
    x1= unroll(ast.left) if isinstance(ast.left, BinExp) else [ast.left]
    x2= unroll(ast.right) if isinstance(ast.right, BinExp) else [ast.right]
    return [*x1, *x2]