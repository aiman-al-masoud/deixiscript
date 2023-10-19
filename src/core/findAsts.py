from typing import Callable, Tuple
from core.language import Ast, Explicit

def findAsts(ast:Ast, fn:Callable[[Ast],bool])->Tuple[Ast, ...]:

    if fn(ast): return (ast,)

    if isinstance(ast, tuple): return tuple(y for x in ast for y in findAsts(x,fn))
    if isinstance(ast, Explicit): return tuple()

    from core.language import subasts

    return tuple(y for x in subasts(ast).values() for y in findAsts(x, fn))
