from typing import cast
from expbuilder import e
from findAsts import findAsts
from language import Ast, BinExp, Command, Implicit, KnowledgeBase, Negation, NounPhrase, Result, VerbSentence, copyAst
from functools import reduce
from subst import  subst


def removeImplicit(ast:Ast, kb:KnowledgeBase)->Result:
    # TODO: sort by specificity to avoid subnounphrase problem 
    implicits = findAsts(ast, lambda x : isinstance(x, Implicit))
    referents = tuple(e(i).get(kb) for i in implicits)
    kb1 = reduce(lambda a,b: e(b).ask(a).kb, referents, kb)
    xs = zip(implicits, referents)
    new = reduce(lambda a,b: subst(b[0])(b[1])(a) , xs, ast)
    return Result(new, kb1)

isConn = lambda x : isinstance(x, BinExp) and x.op in ['and', 'or']
findConjs= lambda x: findAsts(x, isConn)
findTuples = lambda x: findAsts(x, lambda x: isinstance(x, tuple))
isNegVerbSen = lambda x:isinstance(x, VerbSentence) and bool(x.negation)
isCommandVerbSen = lambda x:isinstance(x, VerbSentence) and bool(x.command)

def decompress(ast:Ast)->Ast:

    tups = findTuples(ast)

    if tups:  
        tup = cast(tuple, tups[0])
        and_phrase = reduce(lambda a,b: e(a)._and(b), [e(t) for t in tup]).e
        return decompress(subst(tup)(and_phrase)(ast))
    
    conns = findConjs(ast)
    if not conns: return ast
    conn = cast(BinExp, conns[0])
    if not isNounPhrasish(conn): return ast

    l = decompress(subst(conn)(conn.left)(ast))
    r = decompress(subst(conn)(conn.right)(ast))

    return BinExp( 
        opposite(conn.op) if isinstance(ast, Negation) else conn.op, 
        l, 
        r,
    )

def isNounPhrasish(ast:Ast)->bool:
    if isinstance(ast, NounPhrase): return True
    return isinstance(ast, BinExp) and isNounPhrasish(ast.left) and isNounPhrasish(ast.right)

def opposite(x:Ast)->str:
    if x not in ['and', 'or']: raise Exception('')
    return 'and' if x == 'or' else 'and'

expandNegations \
    = subst(isNegVerbSen)(lambda x: Negation(copyAst(x, 'negation', False)))

expandCommands \
    = subst(isCommandVerbSen)(lambda x: Command(copyAst(x, 'command', False)))
