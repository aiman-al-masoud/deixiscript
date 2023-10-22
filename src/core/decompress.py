from core.findAsts import findAsts
from core.language import Ast, BinExp, Explicit, Implicit, NounPhrase, NounPhrasish, Str
from core.subst import  subst


def decompress(ast:Ast)->Ast:

    if isinstance(ast, Explicit): return ast
    
    conns = findNounPhrasishConjs(ast)
    if not conns: return ast
    conn = conns[0]
    assert isinstance(conn, BinExp)

    op = opposite(conn.op) if ast.negation else conn.op
    left = decompress(subst(conn,conn.left,ast))
    right = decompress(subst(conn,conn.right,ast))

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
    