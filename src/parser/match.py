from functools import reduce
from typing import List, Literal, Type, TypeGuard, cast, get_args, get_origin
from inspect import isclass
from metalang import Lit, Map, Predicate, Pattern, Var, MultiVar

def match(pat:Pattern, toks:List[Lit])->Map|None:

    match pat:
        case [mu, p, *ps] if isMultiVar(mu) and not isMultiVar(p):
            ms = [match([p], [t]) for t in toks]
            c = next((i for i, m in enumerate(ms) if m is not None), None)
            if c is None: return None
            lm = match([mu], toks[:c])
            cm = ms[c]
            rm = match(ps, toks[c+1:])
            return reduceMatchList([cm, lm, rm])
        case [p, *ps] if ps:
            m1 = match([p], toks[:1])
            m2 = match(ps, toks[1:])
            return reduceMatchList([m1, m2])
        case [MultiVar(n, ty, d)]:
            if match([ty], toks) is not None: return {n:toks}
            if d is not None: return {n:[d]}
            return None
        case [Var(n, t)]:
            if len(toks) >1: return None
            if match([t], toks[:1]) is None: return None
            return {n:toks[0]} 
        case [str(x) | int(x) | float(x)]:
            return {} if toks[0]==x else None
        case [p] if isPredicate(p):
            return {} if p(toks) else None
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

def isPredicate(x:object)->TypeGuard[Predicate]:
    if not callable(x): return False
    return not isclass(x) and not get_origin(x)==Literal

def isMultiVar(x:object)->TypeGuard[MultiVar]:
    return isinstance(x, MultiVar)
