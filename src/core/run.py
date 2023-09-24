from functools import reduce
from typing import cast
from expbuilder import does, e, _, every, the
from language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Negation, Noun, Numerality, SyntheticDerivation, SimpleSentence, Which, copyAst
from normalized import decompressed, isImplicitish, removeImplicit
from subst import subst
from KnowledgeBase import KnowledgeBase, Result, WorldModel

# Idiom
# TODO: removeImplicit! Maybe needed also here?
# TODO: subst is needed for cardinality preservation problem!
# TODO: stipulate that Idiom cannot contain Command
# TODO: Command(Idiom()) where?!

def run(ast:Ast, kb:KnowledgeBase)->Result:
    
    # TODO: check for triggered effects in synthetic derivation clauses

    match ast:

        # case SimpleSentence(command=True):
        #     x = copyAst(ast, 'command', False)
        #     return run(Command(x), kb)

        # case SimpleSentence()|Command(SimpleSentence())|Idiom(SimpleSentence())|Negation(SimpleSentence()) if isImplicitish(ast):
        #     x1 = removeImplicit(ast, kb)
        #     x2 = decompressed(x1.head)
        #     return run(x2, x1.kb)
        
        # case Command(SimpleSentence(negation=True)):
        #     v = copyAst(ast.value, 'negation', False)
        #     x = Command(Negation(v))
        #     return run(x, kb)

        # case SimpleSentence(negation=True):
        #     x = copyAst(ast, 'negation', False)
        #     return run(Negation(x), kb)
        
        case Command(v):
            return __tell(v, kb)
        case _:
            return __ask(ast,kb)



def __ask(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:


        case SimpleSentence() if isImplicitish(ast):
            r = __expand(ast, kb)
            return e(r.head).run(r.kb)


        case Idiom(v):
            from matchAst import matchAst
            d = next((d.definition for d in kb.adcs if matchAst(d.definendum, v, kb)), v)
            r = e(d).run(kb)
            return r


        case str(x) | int(x)| float(x):
            return Result(x, kb.updateDD(kb.dd.update(x)))
        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).run(a).kb , xs, kb)
            return Result(xs, kb1)
        case Noun(h):
            cands1 = {x for s in kb.wm for x in s} | {h}
            cands2 = tuple(x for x in cands1 if e(x).does('be')._(h).get(kb))
            cands3 = cands2[0] if len(cands2)==1 else cands2 
            return e(cands3).run(kb)
        case Which(h, w):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(x for x in x2 if e(subst(_, x, w)).get(kb))
            x4 = x3[0] if len(x3)==1 else x3
            return e(x4).run(kb)
        case Numerality(h, c, o):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(sorted(x2, key=lambda x:kb.dd[x]))
            x4 = x3[:c]
            x5 = x4[0] if len(x4)==1 else x4
            return e(x5).run(kb)
        case Negation(v):
            r1 = e(v).run(kb)
            return Result(not r1.head, r1.kb)
        case BinExp('and', l, r):
            r1 = e(l).run(kb)
            r2 = e(r).run(r1.kb)
            return Result(r1.head and r2.head, r2.kb)
        case BinExp('or', l, r):
            r1 = e(l).run(kb)
            r2 = e(r).run(r1.kb)
            return Result(r1.head or r2.head, r2.kb)
        case BinExp('=', l, r):
            return Result(l==r, kb)
        case BinExp('+', l, r):
            raise Exception('')
        case SimpleSentence('be', s, object=o, negation=False, command=False):
            head = o=='thing' or s==o or e(s).does('have')._(o).as_('super').get(kb)
            return Result(head, kb)
        case SimpleSentence('have', s, object=o, as_=a, negation=False, command=False):
            ok = (s,o,a) in kb.wm
            return Result(ok, kb)
        case SimpleSentence(negation=False):
            action = __simpleSentenceToAction(ast)
            return e(action).run(kb)
        case _:
            raise Exception('ask', ast)


def __tell(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:

        case SimpleSentence() if isImplicitish(ast):
            r = __expand(ast, kb)
            return e(r.head).tell(r.kb)
        case int(x) | float(x) | str(x):
            kb1 = e(x).does('be')._(type(x).__name__).tellKb(kb)
            return e(x).run(kb1)
        case Noun(h):
            n = every(h).count(kb)
            new = f'{h}#{n}'
            r1 = e(new).does('be')._(h).tell(kb)            
            return Result(new, r1.kb, r1.addition)
        case Which(h, w):
            r1 = e(h).tell(kb)
            ww = subst(_, r1.head, w)
            r2 = e(ww).tell(kb.addWm(r1.addition))
            return Result(r1.head, r2.kb, r1.addition | r2.addition)
        case Numerality(h, c, o):
            raise Exception('')
        case SimpleSentence('be', s, object=o, negation=False):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case SimpleSentence('have', s, object=o, negation=False, command=False, as_=a):
            delta = {(s, o, a)}
            return Result(True, kb.addWm(delta), delta)
        case SimpleSentence(negation=False):
            action = __simpleSentenceToAction(ast)
            new = e(action).get(kb)
            r1 = e(action).tell(kb)
            subbed = {subst(r1.head, new, x) for x in r1.addition}
            if new: return Result(new, kb, cast(WorldModel, subbed))
            return r1
        case AnalyticDerivation():
            return Result(ast, kb.addDef(ast))
        case SyntheticDerivation():
            raise Exception('')
        case Negation(AnalyticDerivation()):
            raise Exception('')
        case Negation(SyntheticDerivation()):
            raise Exception('')
        case Negation(v):
            r1 = e(v).tell(kb)
            kb1 = kb.subWm(r1.addition).updateDD(r1.kb.dd)
            return Result(True, kb1)
        case BinExp('and'|'or', l, r): # TODO tell or like and?
            r1 = e(l).tell(kb)
            r2 = e(r).tell(r1.kb)
            return Result(True, r2.kb, r1.addition | r2.addition)
        # case Command(v):
        #     return e(v).tell(kb)
        case _:
            raise Exception('tell', ast)


def __simpleSentenceToAction(ast:SimpleSentence):
    x1 = ast.args
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = the('action').which(x3).e
    return x4

def __expand(ast:SimpleSentence, kb:KnowledgeBase):
    x1 = removeImplicit(ast, kb)
    x2 = decompressed(x1.head)
    return Result(x2, x1.kb)