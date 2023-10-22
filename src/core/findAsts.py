from typing import Callable, Sequence
from core.language import Ast
from core.explicit import Explicit

def findAsts(ast:Ast, fn:Callable[[Ast],bool])->Sequence[Ast]:

    if fn(ast): return (ast,)
    if isinstance(ast, Explicit): return tuple()

    return tuple(y for x in vars(ast).values() for y in findAsts(x, fn))
