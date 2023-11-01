from typing import Sequence
from core.Composite import Composite
from core.Ast import Ast
from core.BinExp import BinExp
from core.Str import Str
from core.Implicit import Implicit
from core.Explicit import Explicit


def decompress(ast:Ast)->Ast:

    if not isinstance(ast, Composite): return ast
    
    conns = findThingishConns(ast)
    if not conns: return ast
    conn = conns[0]

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
    
def findThingishConns(ast:Ast)->Sequence[BinExp]:
    if ast.isThingish() and isinstance(ast, BinExp): return [ast]
    return tuple(y for x in vars(ast).values() for y in findThingishConns(x))

