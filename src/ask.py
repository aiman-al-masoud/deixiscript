from functools import reduce
from expbuilder import does, e, _, every, i
from language import AnalyticDerivation, Ast, BinExp, Command, Negation, Noun, Numerality, SyntheticDerivation, SimpleSentence, Which
from linearize import linearize
from subst import subst
from KnowledgeBase import KnowledgeBase, Result


def ask(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:
        case str(x) | int(x)| float(x):
            return Result(x, kb.updateDD(kb.dd.update(x)))
        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).ask(a).kb , xs, kb)
            return Result(xs, kb1)
        case Noun(h):
            cands1 = {x for s in kb.wm for x in s} | {h}
            cands2 = tuple(x for x in cands1 if e(x).does('be')._(h).get(kb))
            cands3 = cands2[0] if len(cands2)==1 else cands2 
            return e(cands3).ask(kb)
        case Which(h, w):
            cands1 = e(h).get(kb)
            cands2 = cands1 if isinstance(cands1, tuple) else (cands1,)
            cands3 = tuple(x for x in cands2 if e(subst(_, x, w)).get(kb))
            cands4 = cands3[0] if len(cands3)==1 else cands3
            return e(cands4).ask(kb)
        case Numerality(h, c, o):
            cands1 = e(h).get(kb)
            cands2 = cands1 if isinstance(cands1, tuple) else (cands1,)
            cands3 = tuple(sorted(cands2, key=lambda x:kb.dd[x]))
            cands4 = cands3[:c]
            cands5 = cands4[0] if len(cands4)==1 else cands4
            return e(cands5).ask(kb)
        case SimpleSentence('be', s, o, False):
            head = o=='thing' or s==o or e(s).does('have')._(o).as_('super').get(kb)
            return Result(head, kb)
        case SimpleSentence('have', s, o, False, False, a):
            head = (s,o,a) in kb.wm
            return Result(head, kb)
        case SimpleSentence():
            action = simpleSentenceToAction(ast)
            return ask(action, kb)
        case Negation(v):
            r1 = e(v).ask(kb)
            return Result(not r1.head, r1.kb)
        case BinExp('and', l, r):
            r1 = e(l).ask(kb)
            r2 = e(r).ask(r1.kb)
            return Result(r1.head and r2.head, r2.kb)
        case BinExp('or', l, r):
            r1 = e(l).ask(kb)
            r2 = e(r).ask(r1.kb)
            return Result(r1.head or r2.head, r2.kb)
        case BinExp('=', l, r):
            return Result(l==r, kb)
        case BinExp('+', l, r):
            raise Exception('')
        case Command(v):
            return tell(v, kb)
        case _:
            raise Exception('ask', ast)


def tell(ast:Ast, kb:KnowledgeBase)->Result:

    match ast:
        case int(x) | float(x) | str(x):
            kb1 = e(x).does('be')._(type(x).__name__).tellKb(kb)
            return e(x).ask(kb1)
        case Noun(h):
            n = every(h).count(kb)
            id = f'{h}#{n}'
            r1 = e(id).does('be')._(h).tell(kb) # if there is an individual cat -> there is also the concept of a cat, concepts are "eternal"
            return Result(id, r1.kb, r1.addition)
        case Which(h, w):
            r1 = tell(h, kb)
            ww = subst(_, r1.head, w)
            r2 = tell(ww, kb.addWm(r1.addition))
            return Result(r1.head, r2.kb, r1.addition | r2.addition)
        case Numerality(h, c, o):
            raise Exception('')
        case SimpleSentence('be', s, o, False):
            return e(s).does('have')._(o).as_('super').tell(kb)
        case SimpleSentence('have', s, o, False, False, a):
            delta = {(s, o, a)}
            return Result(True, kb.addWm(delta), delta)
        case SimpleSentence(v, s, o, False, False):
            action = simpleSentenceToAction(ast)
            return tell(action, kb)
        case AnalyticDerivation():
            return Result(ast, kb.addDef(ast))
        case SyntheticDerivation():
            raise Exception('')
        case Negation(AnalyticDerivation()):
            raise Exception('')
        case Negation(SyntheticDerivation()):
            raise Exception('')
        case Negation(v):
            r1 = tell(v, kb)
            kb1 = kb.subWm(r1.addition).updateDD(r1.kb.dd)
            return Result(True, kb1)
        case BinExp('and', l, r):
            r1 = tell(l, kb)
            r2 = tell(r, r1.kb)
            return Result(True, r2.kb, r1.addition | r2.addition)
        case Command(v):
            return tell(v, kb)
        case _:
            raise Exception('tell', ast)


def simpleSentenceToAction(ast:SimpleSentence):
    x1 = {**ast.complements, 'subject':ast.subject, 'object':ast.object, 'verb':ast.verb}
    x2 = [does('have')._(v).as_(k) for k,v in x1.items() if v]
    x3 = reduce(lambda a,b:a._and(b), x2)

    # # action-participants based hash: does NOT work with understand and generality sort tests
    # entries = tuple(str(k)+'='+str(v) for k,v in x1.items() if v)
    # actionId = reduce(lambda a,b:a+b, entries)
    # x4 = e(actionId).which(x3).e
    # return x4

    x4 = i('action').which(x3).e
    return x4
