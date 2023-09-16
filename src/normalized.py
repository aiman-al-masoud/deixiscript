from typing import cast
from expbuilder import e
from findAsts import findAsts
from language import Ast, BinExp, Command, Explicit, Implicit, Negation, NounPhrase, NounPhrasish, SimpleSentence, copyAst
from functools import partial, reduce
from linearize import linearize
from matchAst import matchAst, sortByGenerality
from subst import  subst
from KnowledgeBase import KnowledgeBase, Result


def normalized(ast:Ast, kb:KnowledgeBase)->Result:

    x0 = definitionOf(kb, ast)
    x1 = expandNegations(x0.head)
    x2 = expandCommands(x1)
    x3 = removeImplicit(x2, x0.kb)
    x4 = decompress(x3.head)
    return Result(x4, x3.kb)
    # TODO: check for triggered effects in synthetic derivation clauses


def removeImplicit(ast:Ast, kb:KnowledgeBase):

    def red(a:Result, b:Ast):
        r1 = e(b).ask(a.kb)
        return Result(subst(b, r1.head, a.head), r1.kb)

    implicits = findAsts(ast, isImplicitNounPhrase)
    sortedImplicitis = sortByGenerality(kb, implicits)
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

isConn = lambda x : isinstance(x, BinExp) and x.op in ['and', 'or']
findConjs= lambda x: findAsts(x, isConn)
findTuples = lambda x: findAsts(x, lambda x: isinstance(x, tuple))
isNegVerbSen = lambda x:isinstance(x, SimpleSentence) and bool(x.negation)
isCommandVerbSen = lambda x:isinstance(x, SimpleSentence) and bool(x.command)

def decompress(ast:Ast)->Ast:

    tups = findTuples(ast)

    if tups and tups[0]:  
        tup = cast(tuple, tups[0])
        and_phrase = reduce(lambda a,b: e(a)._and(b), [e(t) for t in tup]).e
        return decompress(subst(tup,and_phrase,ast))
    
    conns = findConjs(ast)
    if not conns: return ast
    conn = cast(BinExp, conns[0])
    if not isNounPhrasish(conn): return ast

    l = decompress(subst(conn,conn.left,ast))
    r = decompress(subst(conn,conn.right,ast))

    return BinExp( 
        opposite(conn.op) if isinstance(ast, Negation) else conn.op, 
        l, 
        r,
    )

def opposite(x:Ast)->str:
    if x not in ['and', 'or']: raise Exception('')
    return 'and' if x == 'or' else 'and'

expandNegations \
    = partial(subst, isNegVerbSen, lambda x: Negation(copyAst(x, 'negation', False)))

expandCommands \
      = partial(subst, isCommandVerbSen, lambda x: Command(copyAst(x, 'command', False)))



def removeCommands(x:Ast):
    p = partial(subst, lambda x:isinstance(x, Command), lambda x: cast(Command, x).value)
    y = p(x)
    z = p(y)
    return z

# TODO: return Ast list of PASSAGES?
def definitionOf(kb:KnowledgeBase, ast:Ast)->Result:
    kb1 = removeImplicit(ast, kb).kb
    ast1 = removeCommands(ast)
    defs = [d.definition for d in kb1.adcs if matchAst(d.definendum, ast1)]

    if defs: return definitionOf(kb1, defs[0])
    return Result(ast, kb1)