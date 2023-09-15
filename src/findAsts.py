from typing import Callable, Tuple
from language import Ast, Explicit

def findAsts(ast:Ast, fn:Callable[[Ast],bool])->Tuple[Ast, ...]:

    if fn(ast): return (ast,)

    if isinstance(ast, tuple): return tuple(y for x in ast for y in findAsts(x,fn))
    if isinstance(ast, Explicit): return tuple()

    return tuple(y for x in ast.__dict__.values() for y in findAsts(x, fn))
