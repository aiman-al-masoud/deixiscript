from typing import Callable, Sequence
from core.Composite import Composite
from core.Ast import Ast
from core.BinExp import BinExp
from core.Str import Str
from core.Implicit import Implicit
from core.Explicit import Explicit


def decompress(ast:Ast)->Ast:

    if not isinstance(ast, Composite): return ast
    
    conns = findNounPhrasishConjs(ast)
    if not conns: return ast
    conn = conns[0]
    assert isinstance(conn, BinExp)

    op = opposite(conn.op) if ast.negation else conn.op
    left = decompress(ast.subst({conn:conn.left}))
    right = decompress(ast.subst({conn:conn.right}))

    return conn.copy(left=left, right=right, op=op, cmd=ast.cmd)

def opposite(x:Str):
    if x == 'and': return Str('or')
    if x == 'or': return Str('and')
    raise Exception

def isImplicitish(ast:Ast):# method
    if isinstance(ast, Explicit): return False
    if isinstance(ast, Implicit): return True
    r1=any([isImplicitish(x) for x in vars(ast).values()])
    return r1

def findNounPhrasishConjs(x:Ast):
    return findAsts(x, lambda x:x.isThingish() and isinstance(x, BinExp))
    
def findAsts(ast:Ast, fn:Callable[[Ast],bool])->Sequence[Ast]:

    if fn(ast): return (ast,)
    if isinstance(ast, Explicit): return tuple()

    return tuple(y for x in vars(ast).values() for y in findAsts(x, fn))
