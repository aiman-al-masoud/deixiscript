from core.composite import Composite
from core.findAsts import findAsts
from core.Ast import Ast
from core.binexp import BinExp
from core.explicit import Explicit, Str
from core.implicit import Implicit


NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp

def decompress(ast:Ast)->Ast:

    if not isinstance(ast, Composite): return ast
    
    conns = findNounPhrasishConjs(ast)
    if not conns: return ast
    conn = conns[0]
    assert isinstance(conn, BinExp)

    op = opposite(conn.op) if ast.negation else conn.op
    left = decompress(ast.subst({conn:conn.left}))
    right = decompress(ast.subst({conn:conn.right}))

    return BinExp(op=op, left=left, right=right, cmd=ast.cmd)

def opposite(x:Str):
    if x == 'and': return Str('or')
    if x == 'or': return Str('and')
    raise Exception('')

def isIndividual(x:Ast):
    return isinstance(x, str) and '#' in x

def isImplicitish(ast:Ast):
    if isinstance(ast, Explicit): return False
    if isinstance(ast, Implicit): return True
    r1=any([isImplicitish(x) for x in vars(ast).values()])
    return r1

def isNounPhrasish(ast:Ast):
    if not isinstance(ast, NounPhrasish): return False
    if isinstance(ast, NounPhrase): return True
    return all([isNounPhrasish(x) for x in vars(ast).values()])

def isNounPhrasishConn(ast:Ast):
    return isNounPhrasish(ast) and isinstance(ast, BinExp) and ast.op in ['and', 'or']

def findNounPhrasishConjs(x:Ast):
    return findAsts(x, isNounPhrasishConn)
    