from dataclasses import dataclass
from typing import List, Tuple, cast
from expbuilder import e
from findAsts import findAsts
from language import Ast, BinExp, Command, Explicit, Implicit, Negation, NounPhrase, NounPhrasish, SimpleSentence, copyAst
from functools import partial, reduce
from matchAst import matchAst
from subst import  subst
from KnowledgeBase import KnowledgeBase, Result


def normalized(ast:Ast, kb:KnowledgeBase)->Result:
    # TODO: check for definitions in analytic derivaton clauses, and update KB
    x1 = expandNegations(ast)
    x2 = expandCommands(x1)
    x3 = evalImplicit(ast, kb)
    x4 = reduce(lambda a,b: subst(b[0],b[1],a), x3.zipped, x2)
    x5 = decompress(x4)
    return Result(x5, x3.kb)
    # TODO: check for triggered effects in synthetic derivation clauses

def evalImplicit(ast:Ast, kb:KnowledgeBase):

    @dataclass(frozen=True)
    class C:
        kb:KnowledgeBase
        zipped:List[Tuple[Ast, Ast]]
    
    def red(a:C, b:Ast)->C:
        r1=e(b).ask(a.kb)
        return C(r1.kb, [*a.zipped, (b, r1.head)])

    # TODO: sort by specificity to avoid subnounphrase problem
    implicits = findAsts(ast, isImplicitNounPhrase)
    r = reduce(red, implicits, C(kb, []))
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

# TODO: return Ast list of PASSAGES?
def definitionOf(kb:KnowledgeBase, ast:Ast)->Result:
    kb1 = evalImplicit(ast, kb).kb
    defs = [d.definition for d in kb1.adcs if matchAst(d.definendum, ast)]
    if defs: return definitionOf(kb1, defs[0])
    return Result(ast, kb1)
