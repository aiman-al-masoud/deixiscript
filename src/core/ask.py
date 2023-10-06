from functools import reduce
from core.expbuilder import does, e, _, every
from core.language import Ast, BinExp, Command, Derivation, Domino, Idiom, Negation, Noun, Numerality, SimpleSentence, Which
from core.removeImplicit import decompressed, isImplicitish, isSimpleSentenceish, removeImplicit
from core.subst import subst
from core.KnowledgeBase import KnowledgeBase
from functools import cache # or lru_cache

@cache
def ask(ast:Ast, kb:KnowledgeBase)->KnowledgeBase:

    match ast:

        case object() if isImplicitish(ast) and isSimpleSentenceish(ast):            
            r = __makeExplicit(ast, kb)
            return e(r.head).ask(r)
        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).ask(kb)
        case str(x) | int(x) | float(x):
            if not any({x in s for s in kb.wm}): return kb << False
            return kb << x
        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).ask(a), xs, kb)
            return kb1 << xs
        case Noun(h):
            x1 = {x for s in kb.wm for x in s}
            x2 = tuple(x for x in x1 if e(x).does('be')._(h).get(kb))
            x3 = x2[0] if len(x2)==1 else x2 
            return e(x3).ask(kb)
        case Which(h, w):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(x for x in x2 if e(subst(_, x, w)).get(kb))
            x4 = x3[0] if len(x3)==1 else x3
            return e(x4).ask(kb)
        case Numerality(h, card, ord):
            x1 = e(h).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = tuple(sorted(x2, key=lambda x:kb.dd[x], reverse=ord=='last'))
            x4 = x3[:card]
            x5 = x4[0] if len(x4)==1 else x4
            return e(x5).ask(kb)
        case Negation(v):
            r1 = e(v).ask(kb)
            return r1 << (not r1.head)
        case BinExp('and', l, r):
            r1 = e(l).ask(kb)
            if not r1.head: return r1
            r2 = e(r).ask(r1)
            return r2
        case BinExp('or', l, r):
            r1 = e(l).ask(kb)
            if r1.head: return r1
            r2 = e(r).ask(r1)
            return r2
        case BinExp('=', l, r):
            return kb << (l==r)
        case BinExp('+', l, r):
            raise Exception()
        case SimpleSentence(verb='be', subject=s, object=o):
            if o == 'thing': return kb << True
            if e(s).does('have')._(o).as_('super').get(kb): return kb << True
            # if  every('thing').which(e(s).does('have')._(_).as_('super').and_(does('have')._(o).as_('super'))).get(kb):true
            x1 = {x[0] for x in kb.wm if x[2]=='super' and x[1]==o}
            x2 = {x[1] for x in kb.wm if x[2]=='super' and x[0]==s}
            x3 = x1 & x2
            if x3: return kb << True
            return kb << False
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            s = (s,o,a)
            ok = s in kb.wm
            return kb << (s if ok else False)
        case SimpleSentence():
            event = __simpleSentenceToEvent(ast)
            return e(event).ask(kb)
        case Command(v):
            r1 = __tell(v, kb)
            return r1
        case _:
            raise Exception('ask', ast)

@cache
def __tell(ast:Ast, kb:KnowledgeBase)->KnowledgeBase:

    match ast:

        case Idiom(v):
            d = __makeAdLitteram(v, kb)
            return e(d).tell(kb)
        case int(x) | float(x) | str(x):
            kb1 = e(x).does('be')._(type(x).__name__).tell(kb)
            return e(x).ask(kb1)
        case Noun(h):
            n = every(h).count(kb)+1
            new = f'{h}#{n}'
            kb1 = kb << new
            r1 = e(new).does('be')._(h).tell(kb1) 
            return r1 << new
        case Which(h, w):
            r1 = e(h).tell(kb)
            which = subst(_, r1.head, w)
            r2 = e(which).tell(r1)
            return r2 << r1.head
        case Numerality(h, c, o):
            return e(h).tell(kb) # TODO: multi-create
        case SimpleSentence(verb='be', subject=s, object=o):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            delta = frozenset({(s, o, a)})
            kb1  = kb + delta
            return kb1
        case SimpleSentence():
            event = __simpleSentenceToEvent(ast)
            old = e(event).ask(kb)
            if old.head: return old
            return e(event).tell(kb)
        case Derivation():
            return kb + ast
        case Negation(Derivation()):
            raise Exception()
        case Negation(v):
            x1 = e(v).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = {s for s in kb.wm if set(s) & set(x2)}
            x4 = frozenset(x3)
            return kb - x4      #) << True
        case BinExp('and'|'or', l, r):
            r1 = e(l).tell(kb)
            r2 = e(r).tell(r1)
            return r2
        case Domino(v):
            # TODO: when cause is removed, effect should also vanish
            from core.isMatch import isMatch
            r1 = e(v).tell(kb)
            # effects = tuple(e(d.effect).domino.new.e for d in kb.sds if isMatch(d.cause, v, kb))
            effects = tuple(e(d.effect).new.e for d in kb.sds if isMatch(d.cause, v, kb))
            r2 = e(effects).ask(r1)
            return r2
        case Command(v):
            return e(v).tell(kb)
        case _:
            raise Exception('tell', ast)

@cache
def __simpleSentenceToEvent(ast:SimpleSentence):
    x1 = ast.args
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def __makeExplicit(ast:Ast, kb:KnowledgeBase):
    x1 = removeImplicit(ast, kb)
    x2 = decompressed(x1.head)
    return x1 << x2

def __makeAdLitteram(ast:Ast, kb:KnowledgeBase):
    # TODO: recursive idiomatic derivations?
    from core.isMatch import isMatch
    d = next((d.definition for d in kb.ads if isMatch(d.definendum, ast, kb)), ast)    
    return d
