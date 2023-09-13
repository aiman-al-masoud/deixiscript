from functools import reduce
from expbuilder import e, _, every
from language import AnalyticDerivationClause, Ast, BinExp, Command, DerivationClause, KnowledgeBase, Negation, Noun, Numerality, Result, SyntheticDerivationClause, VerbSentence, Which
from subst import subst


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
            cands = tuple(x for x in things if e(subst(_)(x)(w)).get(kb))
            return e(cands).ask(kb)
        case Numerality(h, c, o):
            raise Exception('')
            # things = e(h).get(kb)
            # assert isinstance(things, tuple)
            # sortedThings = tuple(sorted(things, key=lambda x: kb.dd[x]))
            # cands = sortedThings[:c]
            # return e(cands).ask(kb)
        case BinExp('and', l, r):
            r1 = e(l).ask(kb)
            if not r1.head: return Result(False, r1.kb)
            r2 = e(r).ask(r1.kb)
            return r2
        case BinExp('or', l, r):
            raise Exception('')
        case VerbSentence('be', s, o, False):
            head = s == o or e(s).does('have')._(o).as_('super').get(kb)
            return Result(head, kb)
        case VerbSentence('have',s, o, False, False, a):
            head = (s,o,a) in kb.wm
            return Result(head, kb)
        case Negation(v):
            r1 = e(v).ask(kb)
            return Result(not r1.head, r1.kb)
        case Command(v):
            return tell(v, kb)
        case BinExp('=', l, r):
            return Result(l==r, kb)
        case BinExp('+', l, r):
            raise Exception('')
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
            return Result(id,  r1.kb, r1.addition)
        case Which(h, w):
            r1 = tell(h, kb)
            ww = subst(_)(r1.head)(w)
            r2 = tell(ww, kb.addWm(r1.addition))
            return Result(r1.head, r2.kb, r1.addition | r2.addition)
        case Numerality(h, c, o):
            raise Exception('')
            # assert isinstance(c, int)
            # def red(r1:Result, r2:Result):
            #     head = (*r1.head, r2.head) if isinstance(r1.head, tuple) else (r1.head, r2.head)
            #     return Result(head, r2.kb)
            # r = reduce(lambda a,_: red(a, e(h).tell(a.kb)), range(c), Result(tuple(), kb))
            # return r
        case VerbSentence('be', s, o, False):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case VerbSentence('have', s, o, False, False, a):
            delta = {(s, o, a)}
            return Result(True, kb.addWm(delta), delta)
        case DerivationClause():
            raise Exception('')
        case Negation(DerivationClause()):
            raise Exception('')
        case Negation(v):
            r1 = tell(v, kb)
            kb1 = kb.subWm(r1.addition).updateDD(r1.kb.dd)
            return Result(r1.head, kb1) # return Result(tuple(), kb1)
        case BinExp('and', l, r):
            r1 = tell(l, kb)
            r2 = tell(r, r1.kb)
            return r2
            # raise Exception('')
        case _:
            raise Exception('')
