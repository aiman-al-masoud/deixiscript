from functools import reduce
from typing import cast
from expbuilder import does, e, _, every, the
from language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Negation, Noun, Numerality, SyntheticDerivation, SimpleSentence, Which
from normalized import decompressed, isImplicitish, removeImplicit
from subst import subst
from KnowledgeBase import KnowledgeBase, Result, WorldModel

# Idiom
# TODO: removeImplicit! Maybe needed also here?
# TODO: subst is needed for cardinality preservation problem!
# TODO: stipulate that Idiom cannot contain Command
# TODO: Command(Idiom()) where?!

def ask(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:

        case SimpleSentence() if isImplicitish(ast):
            r = __makeExplicit(ast, kb)
            return e(r.head).run(r.kb)
        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).run(kb)
        case str(x) | int(x)| float(x):
            return Result(x, kb + kb.dd.update(x))
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
        case SimpleSentence(verb='be', subject=s, object=o):
            head = o=='thing' or s==o or e(s).does('have')._(o).as_('super').get(kb)
            return Result(head, kb)
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            ok = (s,o,a) in kb.wm
            return Result(ok, kb)
        case SimpleSentence():
            action = __simpleSentenceToAction(ast)
            return e(action).run(kb)
        case Command(v):
            return __tell(v, kb)
        case _:
            raise Exception('ask', ast)


def __tell(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:

        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).tell(kb)
        case SimpleSentence() if isImplicitish(ast):
            r = __makeExplicit(ast, kb)
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
            r2 = e(ww).tell(kb + r1.addition)
            return Result(r1.head, r2.kb, r1.addition | r2.addition)
        case Numerality(h, c, o):
            raise Exception('')
        case SimpleSentence(verb='be', subject=s, object=o):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            delta = frozenset({(s, o, a)})
            return Result(True, kb + delta, delta)
        case SimpleSentence():
            action = __simpleSentenceToAction(ast)
            new = e(action).get(kb)
            r1 = e(action).tell(kb)
            subbed = frozenset({subst(r1.head, new, x) for x in r1.addition})
            if new: return Result(new, kb, cast(WorldModel, subbed)) # TODO: bad cast
            return r1
        case AnalyticDerivation():
            return Result(ast, kb + ast)
        case SyntheticDerivation():
            raise Exception('')
        case Negation(AnalyticDerivation()):
            raise Exception('')
        case Negation(SyntheticDerivation()):
            raise Exception('')
        case Negation(v):
            r1 = e(v).tell(kb)
            kb1 = kb - r1.addition + r1.kb.dd
            return Result(True, kb1)
        case BinExp('and'|'or', l, r): # TODO tell or like and?
            r1 = e(l).tell(kb)
            r2 = e(r).tell(r1.kb)
            return Result(True, r2.kb, r1.addition | r2.addition)
        case _:
            raise Exception('tell', ast)


def __simpleSentenceToAction(ast:SimpleSentence):
    x1 = ast.args
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = the('action').which(x3).e
    return x4

def __makeExplicit(ast:SimpleSentence, kb:KnowledgeBase):
    x1 = removeImplicit(ast, kb)
    x2 = decompressed(x1.head)
    return Result(x2, x1.kb)

def __makeAdLitteram(ast:Ast, kb:KnowledgeBase):
    from matchAst import matchAst
    d = next((d.definition for d in kb.adcs if matchAst(d.definendum, ast, kb)), ast)
    return d
