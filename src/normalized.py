from typing import List, cast
from expbuilder import e
from findAsts import findAsts
from language import Ast, BinExp, Command, Explicit, Implicit, KnowledgeBase, Negation, Noun, NounPhrase, NounPhrasish, Result, SimpleSentence, copyAst
from functools import cmp_to_key, partial, reduce
from matchAst import compareGenAnalyticDc, matchAst
from subst import  subst


def normalized(ast:Ast, kb:KnowledgeBase)->Result:
    # TODO: check for definitions in analytic derivaton clauses
    x1 = expandNegations(ast)
    x2 = expandCommands(x1)
    x3 = removeImplicit(x2, kb)
    x4 = decompress(x3.head)
    # TODO: check for consequences in synthetic derivation clauses
    return Result(x4, x3.kb)


def removeImplicit(ast:Ast, kb:KnowledgeBase)->Result:
    # TODO: sort by specificity to avoid subnounphrase problem 

    implicits = findAsts(ast, isImplicitNounPhrase)
    referents:List[Ast] = []
    kb1 = kb

    for i in implicits:
        r1 = e(i).ask(kb1)
        kb1 = r1.kb
        referents.append(r1.head)
    
    xs = zip(implicits, referents)
    new = reduce(lambda a,b: subst(b[0])(b[1])(a) , xs, ast)
    return Result(new, kb1)

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

def opposite(x:Ast)->str:
    if x not in ['and', 'or']: raise Exception('')
    return 'and' if x == 'or' else 'and'

expandNegations \
    = subst(isNegVerbSen)(lambda x: Negation(copyAst(x, 'negation', False)))

expandCommands \
    = subst(isCommandVerbSen)(lambda x: Command(copyAst(x, 'command', False)))


# TODO: return Ast list of PASSAGES!!
# do you need subst?? not if you update the DD!! Right?!
def definitionOf(kb:KnowledgeBase, ast:Ast)->Ast:
    ds = [d for d in kb.adcs if matchAst(d.definendum, ast)]
    cmp = partial(compareGenAnalyticDc, kb)
    sortedDs = sorted(ds, key=cmp_to_key(cmp))
    defs = [d.definition for d in sortedDs]
    if defs: return definitionOf(kb, defs[0])
    return ast