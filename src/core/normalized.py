from functools import reduce
from core.expbuilder import e
from core.findAsts import findAsts
from core.language import Ast, BinExp, Derivation, Explicit, Implicit, Negation, NounPhrase, NounPhrasish, SimpleSentence
from core.subst import  subst
from core.KnowledgeBase import KnowledgeBase, Result


def removeImplicit(ast:Ast, kb:KnowledgeBase):

    def red(a:Result, b:Ast):
        r1 = e(b).ask(a.kb)
        return Result(subst(b, r1.head, a.head), r1.kb)

    implicits = findAsts(ast, isImplicitNounPhrase)
    # TODO: sort implicits to avoid sub-ast in super-ast subst problem
    sortedImplicitis = implicits
    r = reduce(red, sortedImplicitis, Result(ast, kb))
    return r

def isImplicitNounPhrase(ast:Ast):
    return isImplicitish(ast) and isNounPhrasish(ast)

def isImplicitish(ast:Ast):
    if isinstance(ast, Explicit): return False
    if isinstance(ast, Implicit): return True
    return any([isImplicitish(x) for x in ast.__dict__.values()])

def isNounPhrasish(ast:Ast):
    if not isinstance(ast, NounPhrasish): return False
    if isinstance(ast, NounPhrase): return True
    return all([isNounPhrasish(x) for x in ast.__dict__.values()])

def isNounPhrasishConn(ast:Ast):
    return isNounPhrasish(ast) and isinstance(ast, BinExp) and ast.op in ['and', 'or']

def isAst(x:object):
    return isinstance(x, Ast)

def isSimpleSentenceish(ast:Ast):
    if isinstance(ast, SimpleSentence): return True
    if isinstance(ast, Derivation): return False
    if isinstance(ast, Explicit): return False
    return all([isSimpleSentenceish(x) for x in ast.__dict__.values()])

findNounPhrasishConjs= lambda x: findAsts(x, isNounPhrasishConn)
findTuples = lambda x: findAsts(x, lambda x: isinstance(x, tuple))

def decompressed(ast:Ast)->Ast:

    tups = findTuples(ast)

    if tups:
        tup = tups[0]
        assert isinstance(tup, tuple)
        if not tup: return tuple()
        and_phrase = reduce(lambda a,b: e(a).or_(b), tup).e
        subbed = subst(tup, and_phrase, ast)
        return decompressed(subbed)
    
    conns = findNounPhrasishConjs(ast)
    if not conns: return ast
    conn = conns[0]
    assert isinstance(conn, BinExp)

    op = opposite(conn.op) if isinstance(ast, Negation) else conn.op
    left = decompressed(subst(conn,conn.left,ast))
    right = decompressed(subst(conn,conn.right,ast))

    return BinExp(op, left, right)

def opposite(x:Ast)->str:
    if x not in ['and', 'or']: raise Exception('')
    return 'and' if x == 'or' else 'or'
