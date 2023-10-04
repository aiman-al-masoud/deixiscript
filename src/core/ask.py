from functools import reduce
from core.expbuilder import does, e, _, every
from core.language import Ast, BinExp, Command, Derivation, Domino, Idiom, Negation, Noun, Numerality, SimpleSentence, Which
from core.normalized import decompressed, isImplicitish, isSimpleSentenceish, removeImplicit
from core.subst import subst
from core.KnowledgeBase import KnowledgeBase, Result
from functools import cache # or lru_cache

@cache
def ask(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:

        case object() if isImplicitish(ast) and isSimpleSentenceish(ast):            
            r = __makeExplicit(ast, kb)
            return e(r.head).ask(r.kb)
        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).ask(kb)
        case str(x) | int(x)| float(x):
            if not any({x in s for s in kb.wm}): return Result(False, kb) # TODO #1
            return Result(x, kb + kb.dd.update(x))
        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).ask(a).kb, xs, kb)
            return Result(xs, kb1)
        case Noun(h):
            cands1 = {x for s in kb.wm for x in s} | {h} # TODO #1
            cands2 = tuple(x for x in cands1 if e(x).does('be')._(h).get(kb))
            cands3 = cands2[0] if len(cands2)==1 else cands2 
            return e(cands3).ask(kb)
        case Which(h, w):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(x for x in x2 if e(subst(_, x, w)).get(kb))
            x4 = x3[0] if len(x3)==1 else x3
            return e(x4).ask(kb)
        case Numerality(h, c, o):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(sorted(x2, key=lambda x:kb.dd[x], reverse=True))
            x4 = x3[:c]
            x5 = x4[0] if len(x4)==1 else x4
            return e(x5).ask(kb)
        case Negation(v):
            r1 = e(v).ask(kb)
            return Result(not r1.head, r1.kb)
        case BinExp('and', l, r):
            r1 = e(l).ask(kb)
            if not r1.head: return r1
            r2 = e(r).ask(r1.kb)
            return Result(r1.head and r2.head, r2.kb)
        case BinExp('or', l, r):
            r1 = e(l).ask(kb)
            if r1.head: return r1
            r2 = e(r).ask(r1.kb)
            return Result(r1.head or r2.head, r2.kb)
        case BinExp('=', l, r):
            return Result(l==r, kb)
        case BinExp('+', l, r):
            raise Exception()
        case SimpleSentence(verb='be', subject=s, object=o):
            if o == 'thing': return Result(True, kb)
            if s == o: return Result(True, kb)
            if e(s).does('have')._(o).as_('super').get(kb): return Result(True, kb)            
            # if  every('thing').which(e(s).does('have')._(_).as_('super').and_(does('have')._(o).as_('super'))).get(kb): return Result(True, kb)

            x1 = {x[0] for x in kb.wm if x[2]=='super' and x[1]==o}
            x2 = {x[1] for x in kb.wm if x[2]=='super' and x[0]==s}
            x3 = x1 & x2
            if x3: return Result(True, kb)
            return Result(False, kb)
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            s = (s,o,a)
            ok = s in kb.wm
            return Result(s if ok else False, kb)
        case SimpleSentence():
            action = __simpleSentenceToAction(ast)
            return e(action).ask(kb)
        case Command(v):
            r1 = __tell(v, kb)
            return r1
        case _:
            raise Exception('ask', ast)


def __tell(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:

        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).tell(kb)
        case int(x) | float(x) | str(x):
            kb1 = e(x).does('be')._(type(x).__name__).tellKb(kb)
            return e(x).ask(kb1)
        case Noun(h):
            n = every(h).count(kb)
            new = f'{h}#{n}'
            kb1 = kb + kb.dd.update(new)
            r1 = e(new).does('be')._(h).tell(kb1) 
            return Result(new, r1.kb)
        case Which(h, w):
            r1 = e(h).tell(kb)
            ww = subst(_, r1.head, w)
            r2 = e(ww).tell(r1.kb)
            return Result(r1.head, r2.kb)
        case Numerality(h, c, o):
            return e(h).tell(kb) # TODO: multi-create
        case SimpleSentence(verb='be', subject=s, object=o):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            delta = frozenset({(s, o, a)})
            kb1  = kb + delta
            return Result(True, kb1)
        case SimpleSentence():
            action = __simpleSentenceToAction(ast)
            old = e(action).ask(kb)
            if old.head: return old
            return e(action).tell(kb)
        case Derivation():
            return Result(ast, kb + ast)
        case Negation(Derivation()):
            raise Exception()
        case Negation(v):
            x1 = e(v).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = {s for s in kb.wm if set(s) & set(x2)}
            x4 = frozenset(x3)
            return Result(True, kb - x4)
        case BinExp('and'|'or', l, r):
            r1 = e(l).tell(kb)
            r2 = e(r).tell(r1.kb)
            return Result(True, r2.kb)
        case Domino(v):
            # TODO: when cause is removed, effect should also vanish
            from core.isMatch import isMatch
            r1 = e(v).tell(kb)
            # effects = tuple(e(d.effect).domino.new.e for d in kb.sds if isMatch(d.cause, v, kb))
            effects = tuple(e(d.effect).new.e for d in kb.sds if isMatch(d.cause, v, kb))
            r2 = e(effects).ask(r1.kb)
            return Result(True, r2.kb)
        case Command(v):
            return e(v).tell(kb)
        case _:
            raise Exception('tell', ast)


def __simpleSentenceToAction(ast:SimpleSentence):
    x1 = ast.args
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('action').which(x3).e
    return x4

def __makeExplicit(ast:Ast, kb:KnowledgeBase):
    x1 = removeImplicit(ast, kb)
    x2 = decompressed(x1.head)
    return Result(x2, x1.kb)

def __makeAdLitteram(ast:Ast, kb:KnowledgeBase):
    # TODO: recursive idiomatic derivations?
    from core.isMatch import isMatch
    d = next((d.definition for d in kb.ads if isMatch(d.definendum, ast, kb)), ast)    
    return d
