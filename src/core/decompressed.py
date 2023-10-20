from functools import reduce
from core.expbuilder import e
from core.findAsts import findAsts
from core.language import Ast, BinExp, Explicit, Implicit, NounPhrase, NounPhrasish
from core.subst import  subst


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

findNounPhrasishConjs= lambda x: findAsts(x, isNounPhrasishConn)
findTuples = lambda x: findAsts(x, lambda x: isinstance(x, tuple))

def decompressed(ast:Ast)->Ast:

    tups = findTuples(ast)

    if tups:
        tup = tups[0]
        assert isinstance(tup, tuple)
        if not tup: return tuple()
        orPhrase = reduce(lambda a,b: e(a).or_(b), tup).e
        subbed = subst(tup, orPhrase, ast)
        return decompressed(subbed)
    
    conns = findNounPhrasishConjs(ast)
    if not conns: return ast
    conn = conns[0]
    assert isinstance(conn, BinExp)

    op = opposite(conn.op) if ast.negation else conn.op # pyright: ignore
    left = decompressed(subst(conn,conn.left,ast))
    right = decompressed(subst(conn,conn.right,ast))

    return BinExp(op, left, right)

def opposite(x:Ast)->str:
    if x not in ['and', 'or']: raise Exception('')
    return 'and' if x == 'or' else 'or'

def isIndividual(x:Ast):
    return isinstance(x, str) and '#' in x