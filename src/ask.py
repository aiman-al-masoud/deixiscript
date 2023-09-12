from functools import reduce
from expbuilder import e, _, every
from language import Ast, BinExp, Command, KnowledgeBase, Negation, Noun, Numerality, Result, VerbSentence, Which
from subst import rp


def ask(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:
        case str(x) | int(x)| float(x):
            return Result(x, kb.updateDD(kb.dd.copy(x)))
        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).ask(a).kb , xs, kb)
            return Result(xs, kb1)
        case Noun(h):
            things = {x for s in kb.wm for x in s}
            cands = tuple(x for x in things if e(x).does('be')._(h).get(kb))
            return e(cands).ask(kb)
        case Which(h, w):
            things = e(h).get(kb)
            assert isinstance(things, tuple)
            cands = tuple(x for x in things if e(rp(_, x, w)).get(kb))
            return Result(cands, kb)
        case Numerality(h, c, o):
            raise Exception('')
        case BinExp('=', l, r):
            return Result(l==r, kb)
        case BinExp('and', l, r):
            r1 = e(l).ask(kb)
            if not r1.head: return Result(False, r1.kb)
            r2 = e(r).ask(r1.kb)
            return r2
        case BinExp('or', l, r):
            raise Exception('')
        case BinExp('+', l, r):
            raise Exception('')
        case VerbSentence('be', s, o, False):
            head = s == o or e(s).does('have')._(o)._as('super').get(kb)
            return Result(head, kb)
        case VerbSentence('have',s, o, False, False, a):
            head = (s,o,a) in kb.wm
            return Result(head, kb)
        case VerbSentence(v, s, o, False):
            raise Exception('')
        case Negation(v):
            return Result(not e(v).get(kb), kb)
        case Command(v):
            return tell(ast,kb)
        case _:
            raise Exception('')


def tell(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:
        case int(x) | float(x) | str(x):
            raise Exception('')
        case Noun(h):
            n = every(h).count(kb)
            id = h if n == 0 else f'{h}#{n}'
            sup = 'thing' if id == h else h
            r1 = e(id).does('be')._(sup).tell(kb)
            return Result(id, r1.kb)
        case Which(h, w):
            r1 = tell(h, kb)
            ww = rp(_, r1.head, w)
            r2 = tell(ww, r1.kb)
            return Result(r1.head, r2.kb)
        case Numerality(h, c, o):
            raise Exception('')
        case VerbSentence('be', s, o, False):
            return e(s).does('have')._(o)._as('super').tell(kb)
        case VerbSentence('have', s, o, False, False, a):
            kb1 = kb.addToWm((s, o, a))
            return Result(True, kb1)
        case _:
            raise Exception('')