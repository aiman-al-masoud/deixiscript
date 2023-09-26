from typing import Callable, List, Literal, Type, TypeGuard, cast, get_args, get_origin
from functools import reduce
from inspect import isclass
from parser.metalang import Derivation, Lit, Map, MetaAst, Pattern, Variable

def match(pat:Pattern, toks:List[Lit], ds:List[Derivation]=[])->Map|None:

    # test  = ['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run']

    match pat:
        case [mu, p, *ps] if not isSingle(mu) and isSingle(p):

            # def f(i:int, t:Lit):
            #     c = match([p], [t], ds)
            #     if c is None: return None
            #     do the lm and rm checks right in here
            #     l = toks[:i]
            #     r = toks[i+1:]
            #     lm = match([mu], l, ds)
            #     if test==toks and 'does' in str(pat): print('t=', t, 'l=', l, 'r=', r, 'lm=', lm)
            #     # if l is None: return None
            #     # r = match(ps, toks[i+1:], ds)
            #     # if r is None: return None 
            #     return c

            ms = [match([p], [t], ds) for i, t in enumerate(toks)]

            C = next((i for i, m in enumerate(ms) if m is not None), None)

            if C is None: return None            

            lm = match([mu], toks[:C], ds)
            cm = ms[C]
            rm = match(ps, toks[C+1:], ds)
            return reduceMatchList([cm, lm, rm])

        case [p, *ps] if ps:
            m1 = match([p], toks[:1], ds)
            m2 = match(ps, toks[1:], ds)
            return reduceMatchList([m1, m2])
        case [Variable(n, t, d, num)]:
            if len(toks) > num: return None
            m1 = match([t], toks[:num], ds) is not None
            if not m1 and d is None: return None
            seq = toks if m1 else [d]
            value = seq[:num] if num!=1 else seq[0]
            return {n : value}
        case [str(x) | int(x) | float(x)]:
            return {} if toks[0]==x else None
        case [p] if isPredicate(p):
            if not toks: return None
            from parser.parse import parse
            subast = parse(ds, toks)
            return {} if p(subast) else None
        case [t] if get_origin(t)==Literal:
            return {} if toks[0] in set(get_args(t)) else None
        case [t]:
            if not toks: return None
            return {} if isinstance(toks[0], cast(Type, t)) else None
        case []:
            return {} if toks==[] else None
        case _:
            raise Exception('')

def reduceMatchList(ms:List[Map|None]):
    mss = [m for m in ms if m is not None]
    if len(mss) != len(ms): return None
    r = reduce(lambda a,b: {**a, **b}, mss)
    return r

def isPredicate(x:object)->TypeGuard[Callable]:
    if not callable(x): return False
    return not isclass(x) and not get_origin(x)==Literal

def isSingle(x:MetaAst):
    if isinstance(x, Variable): return x.maxCard==1
    return True
    